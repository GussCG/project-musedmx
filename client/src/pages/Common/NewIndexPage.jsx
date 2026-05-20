import React from "react";
import NavBarMenu from "../../components/Other/NavBarMenu";
import Footer from "../../components/Other/Footer";
import IndexMain from "../../components/Index/IndexMain";
import IndexMuseosDestacados from "../../components/Index/IndexMuseosDestacados";
import IndexNoticias from "../../components/Index/IndexNoticias";
import IndexMobile from "../../components/Index/IndexMobile";

function NewIndexPage() {
  return (
    <>
      <NavBarMenu />
      <div id="n-index-main">
        <IndexMain />
        <IndexMuseosDestacados />
        <IndexNoticias />
        <IndexMobile />
      </div>
      <Footer />
    </>
  );
}

export default NewIndexPage;
