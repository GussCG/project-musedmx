import os
import requests
import pandas as pd
import hashlib
from bs4 import BeautifulSoup
from PIL import Image
from io import BytesIO
from urllib.parse import urlparse
import time
import re
from selenium import webdriver
from selenium.webdriver.edge.service import Service
from selenium.webdriver.edge.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.microsoft import EdgeChromiumDriverManager
from tqdm import tqdm

# CONFIG
MAX_IMAGES_PER_MUSEUM = 10
REQUEST_TIMEOUT = 30
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)..."
MIN_IMAGE_SIZE = 500
RETRY_LIMIT = 3
LOG_FILE = "errores_descarga.log"

# Utils
def log_error(msg):
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(f"{msg}\n")

def image_hash(content):
    return hashlib.md5(content).hexdigest()

def is_valid_image(content):
    try:
        img = Image.open(BytesIO(content))
        return img.size[0] >= MIN_IMAGE_SIZE and img.size[1] >= MIN_IMAGE_SIZE
    except:
        return False

def setup_selenium():
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option("useAutomationExtension", False)
    options.add_argument(f"user-agent={USER_AGENT}")

    service = Service(EdgeChromiumDriverManager().install())
    driver = webdriver.Edge(service=service, options=options)
    driver.execute_cdp_cmd("Network.setUserAgentOverride", {"userAgent": USER_AGENT})
    driver.execute_cdp_cmd("Page.addScriptToEvaluateOnNewDocument", {
        "source": "Object.defineProperty(navigator, 'webdriver', { get: () => undefined })"
    })
    return driver

def download_image(url, museum_name, img_num, output_dir, hash_set):
    for attempt in range(RETRY_LIMIT):
        try:
            resp = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=REQUEST_TIMEOUT)
            resp.raise_for_status()
            content = resp.content

            if not is_valid_image(content):
                return False

            content_hash = image_hash(content)
            if content_hash in hash_set:
                return False
            hash_set.add(content_hash)

            img = Image.open(BytesIO(content))
            ext = img.format.lower() if img.format else "jpg"
            safe_name = re.sub(r'[\\/*?:"<>|]', "_", museum_name)
            museum_dir = os.path.join(output_dir, safe_name)
            os.makedirs(museum_dir, exist_ok=True)

            img_path = os.path.join(museum_dir, f"{safe_name}_img_{img_num}.{ext}")
            if ext == 'jpg' and img.mode in ('RGBA', 'P'):
                img = img.convert('RGB')

            img.save(img_path, quality=85)
            print(f"✔ Imagen guardada: {img_path}")
            return True
        except Exception as e:
            print(f"Error descargando {url} (intento {attempt+1}): {e}")
            time.sleep(1)
            log_error(f"{url} -> {e}")
    return False

def scrape_website_images(url, museum_name, output_dir, existing_count, hash_set):
    try:
        response = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=REQUEST_TIMEOUT)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        img_tags = soup.find_all('img')

        downloaded = 0
        for img in img_tags:
            if downloaded + existing_count >= MAX_IMAGES_PER_MUSEUM:
                break
            img_url = img.get('src') or img.get('data-src') or img.get('data-lazy-src')
            if not img_url:
                continue

            img_url = img_url.split("?")[0].split("#")[0]
            if not img_url.startswith("http"):
                parsed = urlparse(url)
                base_url = f"{parsed.scheme}://{parsed.netloc}"
                img_url = base_url + (img_url if img_url.startswith("/") else "/" + img_url)

            if any(bad in img_url.lower() for bad in ['logo', 'icon', 'svg', 'banner']):
                continue

            if download_image(img_url, museum_name, existing_count + downloaded + 1, output_dir, hash_set):
                downloaded += 1
        return downloaded
    except Exception as e:
        log_error(f"{url} -> {e}")
        return 0

def scrape_google_images(query, museum_name, output_dir, existing_count, driver, hash_set):
    try:
        search_url = f"https://www.google.com/search?q={query}&tbm=isch"
        driver.get(search_url)
        time.sleep(2)

        # Aceptar cookies
        try:
            WebDriverWait(driver, 5).until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(.,'Aceptar todo')]"))
            ).click()
            time.sleep(1)
        except:
            pass

        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)

        thumbnails = driver.find_elements(By.CSS_SELECTOR, "img.Q4LuWd")
        downloaded = 0

        for thumb in thumbnails:
            if downloaded + existing_count >= MAX_IMAGES_PER_MUSEUM:
                break
            try:
                thumb.click()
                time.sleep(0.5)
                big_img = WebDriverWait(driver, 3).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "img.sFlh5c"))
                )
                img_url = big_img.get_attribute("src")
                if img_url and img_url.startswith("http"):
                    if download_image(img_url, museum_name, existing_count + downloaded + 1, output_dir, hash_set):
                        downloaded += 1
            except Exception as e:
                log_error(f"Google image error for {query}: {e}")
                continue
        return downloaded
    except Exception as e:
        log_error(f"Google search error for {query}: {e}")
        return 0

def main(dataset_path, output_dir):
    df = pd.read_csv(dataset_path)
    driver = setup_selenium()

    for _, row in tqdm(df.iterrows(), total=len(df), desc="Museos procesados"):
        museum_name = str(row['museo_nombre']).strip()
        downloaded_count = 0
        hash_set = set()

        for web_field in ['pagina_web', 'pagina_web2', 'pagina_web3']:
            if downloaded_count >= MAX_IMAGES_PER_MUSEUM:
                break
            site = row.get(web_field)
            if pd.notna(site) and isinstance(site, str) and site.strip():
                print(f"🌐 {museum_name} buscando en {web_field}...")
                downloaded_count += scrape_website_images(site, museum_name, output_dir, downloaded_count, hash_set)

        if downloaded_count < MAX_IMAGES_PER_MUSEUM:
            query = f"{museum_name} museo CDMX imágenes"
            print(f"🔍 Google: {query}")
            downloaded_count += scrape_google_images(query, museum_name, output_dir, downloaded_count, driver, hash_set)

        print(f"📸 Total imágenes {museum_name}: {downloaded_count}")
    
    driver.quit()

if __name__ == "__main__":
    DATASET_PATH = "./data/museo-directorio-cdmx.csv"
    OUTPUT_DIR = "museos_imagenes"

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    main(DATASET_PATH, OUTPUT_DIR)
