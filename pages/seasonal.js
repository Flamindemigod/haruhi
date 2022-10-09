import { useDispatch } from "react-redux";
import { setLoading } from "../features/loading";
import { useState, useEffect } from "react";
import Meta from "../components/Meta";
import { SERVER } from "../config";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import getCurrentSeason from "../getCurrentSeason";
import List from "../components/Seasonal/List";

const seasonal = () => {
  const dispatch = useDispatch();
  const [season, setSeason] = useState();
  const [seasonYear, setSeasonYear] = useState();

  const handleChange = (event, newValue) => {
    setSeason(newValue);
    let currentTime = new Date();
    let currentYear = currentTime.getUTCFullYear();
    let currentMonth = currentTime.getMonth();

    if (newValue === "WINTER") {
      if (currentMonth >= 10) {
        setSeasonYear(currentYear);
      } else {
        setSeasonYear(currentYear);
      }
    }
  };

  useEffect(() => {
    const [_season, _seasonYear] = getCurrentSeason();
    setSeason(_season);
    setSeasonYear(_seasonYear);
  }, []);
  useEffect(() => {
    dispatch(setLoading(false));
  }, []);
  return (
    <div>
      <Meta
        title="Haruhi - Seasonal List"
        description="List of Seasonal Anime"
        url={`${SERVER}/seasonal`}
      />
      <Tabs
        centered
        value={season}
        onChange={handleChange}
        aria-label="icon label tabs example"
      >
        <Tab
          wrapped
          sx={{ width: "min-content" }}
          label={`WINTER ${seasonYear + 1}`}
          value={"WINTER"}
        />
        <Tab
          wrapped
          sx={{ width: "min-content" }}
          label={`SPRING ${seasonYear}`}
          value="SPRING"
        />
        <Tab
          wrapped
          sx={{ width: "min-content" }}
          label={`SUMMER ${seasonYear}`}
          value="SUMMER"
        />
        <Tab
          wrapped
          sx={{ width: "min-content" }}
          label={`FALL ${seasonYear}`}
          value="FALL"
        />
      </Tabs>
      <List
        season={season}
        seasonYear={season === "WINTER" ? seasonYear + 1 : seasonYear}
      />
    </div>
  );
};

export default seasonal;
