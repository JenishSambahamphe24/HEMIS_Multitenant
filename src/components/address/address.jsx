import { useState, useEffect } from "react";
import axios from "axios";
import {config} from '@config';

function useAddressData() {
  const backendUrl = config.VITE_BACKEND_URL;
  const [address, setAddress] = useState([]);
  const [uniqueProvinces, setUniqueProvinces] = useState([]);
  const [uniqueDistricts, setUniqueDistricts] = useState([]);
  const [uniqueLocalLevels, setUniqueLocalLevels] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedLocalLevel, setSelectedLocalLevel] = useState(null);
  const [noOfWards, setNoOfWards] = useState({});
  const [uniqueProvinces2, setUniqueProvinces2] = useState([]);
  const [uniqueDistricts2, setUniqueDistricts2] = useState([]);
  const [uniqueLocalLevels2, setUniqueLocalLevels2] = useState([]);
  const [selectedProvince2, setSelectedProvince2] = useState(null);
  const [selectedDistrict2, setSelectedDistrict2] = useState(null);
  const [selectedLocalLevel2, setSelectedLocalLevel2] = useState(null);
  const [noOfWards2, setNoOfWards2] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/Address/GetAll`);
        const addressData = response.data.map((item) => ({
          ...item,
          Province: item.province,
          District: item.district,
          LocalLevel: item.localLevel,
          noOfWard: item.noOfWard,
        }));
        setAddress(addressData);
        setUniqueProvinces(
          Array.from(new Set(addressData.map((item) => item.Province)))
        );

        const provinceWithUniqueDistrictMap = new Map();
        addressData.forEach((address) => {
          const { Province, District } = address;
          if (!provinceWithUniqueDistrictMap.has(Province)) {
            provinceWithUniqueDistrictMap.set(Province, []);
          }
          if (!provinceWithUniqueDistrictMap.get(Province).includes(District)) {
            provinceWithUniqueDistrictMap.get(Province).push(District);
          }
        });

        const localLevelWardsMap = {};
        addressData.forEach(({ LocalLevel, noOfWard }) => {
          localLevelWardsMap[LocalLevel] = noOfWard;
        });
        setNoOfWards(localLevelWardsMap);
        setUniqueProvinces2(
          Array.from(new Set(addressData.map((item) => item.Province)))
        );
        const provinceWithUniqueDistrictMap2 = new Map();
        addressData.forEach((address) => {
          const { Province, District } = address;
          if (!provinceWithUniqueDistrictMap2.has(Province)) {
            provinceWithUniqueDistrictMap2.set(Province, []);
          }
          if (
            !provinceWithUniqueDistrictMap2.get(Province).includes(District)
          ) {
            provinceWithUniqueDistrictMap2.get(Province).push(District);
          }
        });
        const localLevelWardsMap2 = {};
        addressData.forEach(({ LocalLevel, noOfWard }) => {
          localLevelWardsMap2[LocalLevel] = noOfWard;
        });
        setNoOfWards2(localLevelWardsMap2);
      } catch (error) {
        console.error("Error fetching address data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      const filteredDistricts = address
        .filter((data) => data.Province === selectedProvince)
        .map((data) => data.District)
        .flat();
      setUniqueDistricts(Array.from(new Set(filteredDistricts)));
    }
  }, [selectedProvince, address]);

  useEffect(() => {
    if (selectedProvince && selectedDistrict) {
      const filteredLocalLevels = address
        .filter(
          (data) =>
            data.Province === selectedProvince &&
            data.District === selectedDistrict
        )
        .map((data) => data.LocalLevel)
        .flat();
      setUniqueLocalLevels(Array.from(new Set(filteredLocalLevels)));
    }
  }, [selectedProvince, selectedDistrict, address]);

  // useEffect(() => {
  //   if (selectedLocalLevel) {
  //     setNoOfWards((prev) => prev[selectedLocalLevel] || 0);
  //   }
  // }, [selectedLocalLevel, noOfWards]);

  useEffect(() => {
    if (selectedProvince2) {
      const filteredDistricts2 = address
        .filter((data) => data.Province === selectedProvince2)
        .map((data) => data.District)
        .flat();
      setUniqueDistricts2(Array.from(new Set(filteredDistricts2)));
    }
  }, [selectedProvince2, address]);
  useEffect(() => {
    if (selectedProvince2 && selectedDistrict2) {
      const filteredLocalLevels2 = address
        .filter(
          (data) =>
            data.Province === selectedProvince2 &&
            data.District === selectedDistrict2
        )
        .map((data) => data.LocalLevel)
        .flat();
      setUniqueLocalLevels2(Array.from(new Set(filteredLocalLevels2)));
    }
  }, [selectedProvince2, selectedDistrict2, address]);

  useEffect(() => {
    if (selectedLocalLevel2) {
      setNoOfWards2((prev) => prev[selectedLocalLevel2] || 0);
    }
  }, [selectedLocalLevel2, noOfWards2]);
  const handleLocalLevelSelect2 = (selectedLocalLevel2) => {
    setSelectedLocalLevel2(selectedLocalLevel2);
  };

  return {
    address,
    uniqueProvinces,
    uniqueDistricts,
    uniqueLocalLevels,
    selectedProvince,
    setSelectedProvince,
    selectedDistrict,
    setSelectedDistrict,
    selectedLocalLevel,
    setSelectedLocalLevel,
    noOfWards,
    uniqueProvinces2,
    uniqueDistricts2,
    uniqueLocalLevels2,
    selectedProvince2,
    setSelectedProvince2,
    selectedDistrict2,
    setSelectedDistrict2,
    selectedLocalLevel2,
    handleLocalLevelSelect2,
    noOfWards2,
  };
}

export default useAddressData;
