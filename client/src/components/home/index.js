import React, { useReducer, useEffect } from "react";
import { Grid, Button } from "@material-ui/core";
import ArticleCard from "../../utils/articleCard";
import { useDispatch, useSelector } from "react-redux";
import { getArticles } from "../../store/actions/article_actions";

const initialSort = {
  sortBy: "_id",
  order: "desc",
  limit: 8,
  skip: 0,
};

const Home = () => {
  const [sort, setSort] = useReducer(
    (state, newState) => ({
      ...state,
      ...newState,
    }),
    initialSort
  );

  const articles = useSelector((state) => state.articles);
  const dispatch = useDispatch();

  // trigger only on first render
  useEffect(() => {
    if (articles && !articles.articles) {
      dispatch(getArticles(initialSort));
    }
  }, [dispatch, articles]);
  return (
    <>
      <div>CAROUSEL</div>

      <Grid container spacing={2} className="article_container">
        {articles && articles.articles
          ? articles.articles.map((item) => {
              return (
                <Grid key={item._id} item xs={12} sm={6} lg={3}>
                  <ArticleCard key={item._id} article={item}></ArticleCard>
                </Grid>
              );
            })
          : null}
      </Grid>
      <Button
        variant="contained"
        color="primary"
        type="submit"
        size="large"
        className="mt-3"
        onClick={() => {
          let skip = sort.skip + sort.limit;
          dispatch(getArticles({ ...sort, skip: skip }));
          setSort({ skip: skip });
        }}>
        Load More
      </Button>
    </>
  );
};

export default Home;
