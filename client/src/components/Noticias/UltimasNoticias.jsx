import { useEffect, useMemo } from "react";
import NoticiaCard from "../Museo/NoticiaCard";
import ReactPaginate from "react-paginate";
import NoticiaCardSkeleton from "./NoticiaCardSkeleton";

import Icons from "../Other/IconProvider";
const { IoIosArrowForward, IoIosArrowBack } = Icons;

function UltimasNoticias({
  noticias,
  currentFilter,
  onFilterChange,
  currentPage,
  onPageChange,
  loading,
}) {
  const itemsPerPage = 4;

  const pageCount = Math.ceil(noticias.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = noticias.slice(offset, offset + itemsPerPage);

  const handlePageClick = (event) => {
    onPageChange(event.selected);
    const section = document.querySelector(".ultimas-noticias");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="ultimas-noticias">
      <div className="section-header">
        <h2>Lo último en la red</h2>
        <div className="filter-pills">
          <button
            className={currentFilter === "todas" ? "active" : ""}
            onClick={() => onFilterChange("todas")}
          >
            Todas
          </button>
          <button
            className={currentFilter === "museos" ? "active" : ""}
            onClick={() => onFilterChange("museos")}
          >
            Con Museo
          </button>
        </div>
      </div>

      <div
        key={`${currentFilter}-${currentPage}`}
        className={`noticias-grid-main items-${currentItems.length}`}
      >
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <NoticiaCardSkeleton
                key={i}
                variant={
                  i === 0 || (currentItems.length === 3 && i === 2) || i === 3
                    ? "featured"
                    : "standard"
                }
              />
            ))
          : currentItems.map((noticia, index) => (
              <NoticiaCard
                key={noticia.url}
                noticia={noticia}
                variant={
                  index === 0 ||
                  (currentItems.length === 3 && index === 2) ||
                  index === 3
                    ? "featured"
                    : "standard"
                }
              />
            ))}
      </div>

      {pageCount > 1 && (
        <ReactPaginate
          breakLabel="..."
          breakClassName="break"
          nextLabel={<IoIosArrowForward />}
          onPageChange={(event) => {
            handlePageClick(event);
          }}
          pageRangeDisplayed={1}
          marginPagesDisplayed={1}
          pageCount={pageCount}
          previousLabel={<IoIosArrowBack />}
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="previous"
          previousLinkClassName="previous"
          nextClassName="next"
          nextLinkClassName="next"
          breakLinkClassName="page-link"
          activeClassName="active"
          forcePage={currentPage}
        />
      )}
    </section>
  );
}

export default UltimasNoticias;
