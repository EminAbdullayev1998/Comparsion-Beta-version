import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import CountryData from "/mergeddataset.csv";
import "./sass/style.scss";

function App() {
	const [data, setData] = useState([]); // state csv data saxlamaq ucun
	// select-lere gore datanin filter olunmasi
	const [filteredData, setFilteredData] = useState([]);
	const [selectedYear, setSelectedYear] = useState("2020");
	const [selectedCountry, setSelectedCountry] = useState("");
	const [selectedSector, setSelectedSector] = useState("Economy");
	const [selectedSubsector, setSelectedSubsector] = useState("Government");
	const [selectedIndicator, setSelectedIndicator] = useState("Government spending billion USD");
	
	const [subsectors, setSubsectors] = useState([]);
	// sektorlara gore subsectorlari maplamaq cixarmaq
	const [sectorSubsectorMapping, setSectorSubsectorMapping] = useState({});
	const [indicators, setIndicators] = useState([]);
	const [subsectorIndicatorMapping, setSubsectorIndicatorMapping] = useState({});

	// input range kodlari
	const [sliderValue, setSliderValue] = useState(10);

	console.log(data);

	useEffect(() => {
		// csv data yuklemek d3 methodu ile
		d3.csv(CountryData).then((csvData) => {
			setData(csvData);
		});
	}, []); // ancaq bir defe calistirir

	// Tekrar eden ülke isimlerini kaldırmak için bir Set kullanıyoruz
	const uniqueCountryNames = [...new Set(data.map((item) => item.Country))];

	const uniqueYears = [...new Set(data.map((item) => item.Year))];

	const uniqueSectors = [...new Set(data.map((item) => item.Sector))];

	// const uniqueSubSectors = [...new Set(data.map((item) => item.Subsector))];

	const uniqueIndicators = [...new Set(data.map((item) => item.Indicator))];

	// ilin p herfine yazilmasi
	const handleYearChange = (e) => {
		setSelectedYear(e.target.value);
	};

	// Calculate the sector to subsector mapping dynamically based on your data
	useEffect(() => {
		const sectorMapping = {};
		const subsectorMapping = {};

		data.forEach((entry) => {
			const sector = entry.Sector;
			const subsector = entry.Subsector;
			const indicator = entry.Indicator;

			// Update sector mapping
			if (!sectorMapping[sector]) {
				sectorMapping[sector] = [subsector];
			} else if (!sectorMapping[sector].includes(subsector)) {
				sectorMapping[sector].push(subsector);
			}

			// Update subsector mapping
			if (!subsectorMapping[subsector]) {
				subsectorMapping[subsector] = [indicator];
			} else if (!subsectorMapping[subsector].includes(indicator)) {
				subsectorMapping[subsector].push(indicator);
			}
		});

		setSectorSubsectorMapping(sectorMapping);
		setSubsectorIndicatorMapping(subsectorMapping);
	}, [data]);

	useEffect(() => {
		// Filter data based on selected filters
		const newData = data.filter((entry) => {
			return (
				(selectedYear == "" || entry.Year == selectedYear) &&
				(selectedCountry == "" || entry.Country == selectedCountry) &&
				(selectedSector == "" || entry.Sector == selectedSector) &&
				(selectedSubsector == "" || entry.Subsector == selectedSubsector) &&
				(selectedIndicator == "" || entry.Indicator == selectedIndicator)
			);
		});

		// Update filteredData with the filtered result
		setFilteredData(newData);

		// Update subsectors based on selected sector
		const mappedSubsectors = sectorSubsectorMapping[selectedSector] || [];
		setSubsectors(mappedSubsectors);
		// Update indicators based on selected subsector
		const mappedIndicators = subsectorIndicatorMapping[selectedSubsector] || [];
		setIndicators(mappedIndicators);
	}, [selectedYear, selectedCountry, selectedSector, selectedSubsector, selectedIndicator, data]);

	// Filtre değerlerini sıfırlayan fonksiyon
	const resetFilter = (filterSetter) => {
		filterSetter("");
	};

	// datami amount boyukden kiciye dogru siralamaq kodlari
	const sortedData = filteredData.slice().sort((a, b) => b.amount - a.amount); // amount deyerine gore siralamaq

	const handleSliderChange = (e) => {
		const newValue = parseInt(e.target.value);
		setSliderValue(newValue);
	};

	//  datani input range deyerine deyismesine gore sayini cixartmaq
	const slicedData = sortedData.slice(0, sliderValue);

	return (
		<>
			<div className="main">
				<div className="title">
					<select>
						<option>Country Comparsion</option>
					</select>
					<select>
						<option>Chart</option>
					</select>
				</div>
				<div className="select-options">
					<select
						onChange={(e) => {
							if (e.target.value === "All Country") {
								resetFilter(setSelectedCountry); // bu selecti sifirlamaq
							} else {
								setSelectedCountry(e.target.value);
							}
						}}>
						<option value="All Country">All Country</option>
						{uniqueCountryNames.map((countryName, index) => (
							<option key={index} value={countryName}>
								{countryName}
							</option>
						))}
					</select>
					<select
						onChange={(e) => {
							if (e.target.value === "Year") {
								resetFilter(setSelectedYear); // Sadece bu seçeneği sıfırla
							} else {
								handleYearChange(e);
								setSelectedYear(e.target.value);
							}
						}}
						value={selectedYear}>
						<option>Year</option>
						{uniqueYears.map((uniqueYears, index) => (
							<option key={index} value={uniqueYears}>
								{uniqueYears}
							</option>
						))}
					</select>
					<select
						onChange={(e) => {
							if (e.target.value === "Sector") {
								resetFilter(setSelectedSector); // selecti sifirlamaq
							} else {
								setSelectedSector(e.target.value);
							}
						}}
						value={selectedSector}>
						<option>Sector</option>
						{uniqueSectors.map((sectorName, index) => (
							<option key={index} value={sectorName}>
								{sectorName}
							</option>
						))}
					</select>
					<select
						onChange={(e) => {
							if (e.target.value === "Subsector") {
								resetFilter(setSelectedSubsector); // selecti sifirlamaq
							} else {
								setSelectedSubsector(e.target.value);
							}
						}}
						value={selectedSubsector}>
						<option>Subsector</option>
						{subsectors.map((subsector, index) => (
							<option key={index} value={subsector}>
								{subsector}
							</option>
						))}
					</select>
					<select
						onChange={(e) => {
							if (e.target.value === "Indicator") {
								resetFilter(setSelectedIndicator); // selecti sifirlamaq
							} else {
								setSelectedIndicator(e.target.value);
							}
						}}
						value={selectedIndicator}>
						<option>Indicator</option>
						{indicators.map((indicator, index) => (
							<option key={index} value={indicator}>
								{indicator}
							</option>
						))}
					</select>
					<div className="num-box">
						<p>1</p>
					</div>
					<div className="range-box">
						<div className="range-line">
							<input
								type="range"
								className="form-range"
								id="customRange1"
								min={1}
								max={223}
								value={sliderValue}
								onChange={handleSliderChange}
							/>
						</div>
						<div className="range-text">
							<p>Min 1</p> <p>Max 223</p>
						</div>
					</div>
					<div className="number-box">
						<p>{sliderValue}</p>
					</div>
				</div>
				<div className="list">
					<div className="text">
						<p>Gross Domestic Product billions of U.S dollars in {selectedYear} year</p>
					</div>
					<div className="subtitle">
						<div className="title-1">
							<p>Rank</p>
						</div>
						<div className="title-2">
							<p>Country</p>
						</div>
					</div>
					<div className="result-box">
						<div className="result-box">
							{slicedData.map((entry, index) => {
								let barWidth = 100; // Default width
								let barColor = "#87a6b8"; // Default color

								if (index === 0) {
									barWidth = 90;
									barColor = "#265d7e";
								} else if (index === 1) {
									barWidth = 70;
									barColor = "#265d7e";
								} else if (index === 2) {
									barWidth = 50;
									barColor = "#265d7e";
								} else if (index === 3 || index === 4){
									barWidth = 30;
								} else {
									barWidth = 20;
								}

								return (
									<div key={index} className="list-card">
										<div className="rank">
											<p>{index + 1}</p>
										</div>
										<div className="name">
											<p>{entry.Country}</p> <img src={`https://flagsapi.com/${entry.Country_code_2}/flat/64.png`} />
										</div>
										<div className="bar-div">
											<div className="main-bar">
												<div
													className="bar"
													style={{ width: `${barWidth}%`, backgroundColor: barColor }}></div>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default App;
