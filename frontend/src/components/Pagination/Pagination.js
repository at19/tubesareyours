import React, { useState } from 'react';

const Pagination = ({ className, requestBody, nextDisabled, prevDisabled, onNextClick, onPrevClick }) => (
  <>
    <button className="pagination" disabled={(pageNumber === 0)} onClick={() => setPageNumber(pageNumber - 1)}>&larr; Prev</button>
    <button className="pagination" disabled={!(!loading && !reachedMaxPageNumber)} onClick={() => setPageNumber(pageNumber + 1)}>Next &rarr;</button>
  </>
)


export const ENTRIES_PER_PAGE = 25;
export default Pagination;