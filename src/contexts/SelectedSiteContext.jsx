import React, { createContext, useEffect, useState } from "react";

export const SelectedSiteContext = createContext(null);

const SelectedSiteContextProvider = ({ children }) => {
  const [allSiteData, setAllSiteData] = useState();
  const [allPowerData, setAllPowerData] = useState();
  const [powerDataDate, setPowerDataDate] = useState();

  const [hoveredSiteIndex, setHoveredSiteIndex] = useState(-1);
  const [hoveredSiteData, setHoveredSiteData] = useState(null);

  const [selectedSiteIndex, setSelectedSiteIndex] = useState(-1);
  const [selectedSiteData, setSelectedSiteData] = useState(null);
  const [selectedSitePositionData, setSelectedSitePositionData] = useState(
    null
  );

  const selectedSitePositionDataHandler = (data) => {
    setSelectedSitePositionData(data);
  };

  const selectedSiteIndexHandler = (index) => {
    setSelectedSiteIndex(index);
  };

  const hoveredSiteIndexHandler = (index) => {
    setHoveredSiteIndex(index);
  };

  const siteDataCurate = (data) => {
    const dataArray = [];

    data.forEach((site) => {
      const objToReturn = {
        site: site["Site Name"],
        latitude: site["Latitude"],
        longitude: site["Longitude"],
        code: site["Site Code"],
        pic: site["Pic File"],
        stateAbrv: site["State"],
        city: site["City"],
        region: site["Region"],
        rxType: site["Rx Type"],
        units: site["Units"]
      };

      dataArray.push(objToReturn);
    });

    return dataArray;
  };

  const powerDataCurate = (data) => {
    const powerArray = data.split("\r").slice(1);
    const date = new Date(powerArray[0].split("|")[0]);
    setPowerDataDate(date.toDateString());
    const dataArray = [];

    powerArray.forEach((element) => {
      const elementArray = element.split("|");
      dataArray.push({
        site: elementArray[1],
        power: elementArray[2]
      });
    });
    return dataArray;
  };

  const consolidateSelectedData = (data) => {
    data.units.forEach((unit) => {
      let power = null;

      if (allPowerData) {
        power = allPowerData.find((info) => info.site === unit.powerName).power;
      }

      unit.power = power;
    });

    return data;
  };

  useEffect(() => {
    //fetch site meta data
    fetch(`/data/sites.json`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setAllSiteData(siteDataCurate(data));
      })
      .catch((err) => console.log(err));

    //fetch NRC power data
    // fetch(`https://www.nrc.gov/reading-rm/doc-collections/event-status/reactor-status/powerreactorstatusforlast365days.txt`,
    fetch(`/data/power.txt`, {
      method: "GET",
      headers: {
        "Content-Type": "text/plain"
      }
    })
      .then((res) => res.text())
      .then((data) => {
        setAllPowerData(powerDataCurate(data));
      });
  }, []);

  useEffect(() => {
    if (!allSiteData) return;
    setSelectedSiteIndex(0);
  }, [allSiteData]);

  useEffect(() => {
    if (!allSiteData || selectedSiteIndex < 0) return;

    const siteDataSelected = allSiteData[selectedSiteIndex];
    let dataToPushToSelectedSiteData = { ...siteDataSelected };

    if (allPowerData) {
      dataToPushToSelectedSiteData = consolidateSelectedData(siteDataSelected);
    }

    setSelectedSiteData(dataToPushToSelectedSiteData);
  }, [selectedSiteIndex, allPowerData]);

  useEffect(() => {
    if (hoveredSiteIndex < 0) {
      setHoveredSiteData(null);
      return;
    }

    if (!allSiteData) return;

    const siteDataHovered = allSiteData[hoveredSiteIndex];
    let dataToPushToHoveredSiteData = { ...siteDataHovered };

    if (allPowerData) {
      dataToPushToHoveredSiteData = consolidateSelectedData(siteDataHovered);
    }
    setHoveredSiteData(dataToPushToHoveredSiteData);
  }, [hoveredSiteIndex]);

  return (
    <SelectedSiteContext.Provider
      value={{
        allSiteData,
        hoveredSiteData,
        hoveredSiteIndex,
        powerDataDate,
        selectedSiteIndex,
        selectedSiteData,
        selectedSitePositionData,
        hoveredSiteIndexHandler,
        selectedSiteIndexHandler,
        selectedSitePositionDataHandler
      }}
    >
      {children}
    </SelectedSiteContext.Provider>
  );
};

export default SelectedSiteContextProvider;
