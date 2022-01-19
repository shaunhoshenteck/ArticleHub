import React, { useState, useEffect } from "react";
import { Grid, Button } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import ArticleCard from "../../utils/articleCard";
import Loader from "../../utils/loader";
import { getSearchNavResults } from "../../store/actions/article_actions";

const SearchResults = (props) => {
  const articles = useSelector((state) => state.articles);
  const query = new URLSearchParams(props.location.search);
  const keywords = query.get("keywords");
  const [cardCount, setcardCount] = useState(0);
  const dispatch = useDispatch();

  const getMoreSearchCards = () => {
    const newCount =
      cardCount + articles.navsearch.limit + articles.navsearch.limit;
    setcardCount(newCount);
  };

  useEffect(() => {
    dispatch(getSearchNavResults(1, cardCount, keywords));
  }, [cardCount, dispatch, keywords]);

  return (
    <>
      {articles.navsearch && articles.navsearch.docs ? (
        <>
          <p>
            Your search for <b>"{keywords}"</b> returned{" "}
            <b>{articles.navsearch.totalDocs}</b> results
          </p>
          <Grid container spacing={2} className="article_card">
            {articles.navsearch.docs.map((item) => {
              return (
                <Grid key={item._id} item xs={12} sm={6} lg={3}>
                  <ArticleCard article={item}></ArticleCard>
                </Grid>
              );
            })}
          </Grid>
          {cardCount <= articles.navsearch.totalDocs ? (
            <Button
              variant="contained"
              color="primary"
              type="submit"
              size="large"
              className="mt-3"
              onClick={getMoreSearchCards}>
              More
            </Button>
          ) : null}
        </>
      ) : (
        <Loader></Loader>
      )}
    </>
  );
};

export default SearchResults;
