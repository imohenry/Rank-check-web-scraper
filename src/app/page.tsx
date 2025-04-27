"use client";

import { useState, useEffect } from "react";
import Image from 'next/image';
// import plus from "@/images/plus.svg"
// import x from "@/images/x.svg"
import bolt from "@/images/bolt.svg"
import logo from "@/images/logo.svg"
import spin from "@/images/spin.svg"
// import plusGrey from "@/images/plus-grey.svg"
import resultIcon from "@/images/results-icon.svg"
import trash from "@/images/trash.svg"
// import mambaLogo from "@/images/mamba-logo.svg"


// Define the structure for each keyword's SEO result
interface KeywordResult {
  keyword: string;
  ranking: number;
  country: string; // Ensure this is the correct type
}

// Define the structure for SEO results per website
interface SEOResults {
  website: string;
  keywords: KeywordResult[];
  country: string;
}

// The main functional component for the page
export default function Home() {
  const [url, setUrl] = useState("");
  const [keyword, setKeyword] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<SEOResults | null>(null);
  const [isUrlValid, setIsUrlValid] = useState(true);
  const [keywordError, setKeywordError] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  // Function to fetch results and handle cases where there are no matching rankings
  const fetchResults = async () => {
    setIsAnalyzing(true);
  
    try {
      const res = await fetch('/api/rank-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          keywords: [keyword],  // single input 
          country: selectedCountry, // I am Passing selected country here
        }),
      });
      
  
      const data = await res.json();
  
      if (res.ok) {
        setResults({
          website: data.website,
          keywords: data.keywords || [],
          country: data.country
        });
      } else {
        console.error('Error fetching SEO results:', data.error);
      }
    } catch (error) {
      console.error('Error fetching SEO results:', error);
    }
  
    setIsAnalyzing(false);
  };

  useEffect(() => {
    const selectElement = document.querySelector(".custom-select") as HTMLSelectElement;

    if (selectElement) {
      // Change color based on whether an option is selected
      if (selectedCountry === "") {
        selectElement.style.color = "#C2C2C2"; // Placeholder color
      } else {
        selectElement.style.color = "#0B0B0B"; // Option color
      }
    }
  }, [selectedCountry]);

    // URL validation function
    const validateUrl = (value: string) => {
      const urlPattern = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/;
      return urlPattern.test(value);
    };
  
    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setUrl(value);
      setIsUrlValid(validateUrl(value));
    };

// Function to handle analysis
const handleAnalyze = () => {
  if (!url || !keyword) {
    setKeywordError(true); // Trigger error state if URL or keyword is missing
  } else if (!isUrlValid) {
    // Display an error if the URL is invalid
    alert("Please enter a valid URL before analysing.");
  } else {
    setKeywordError(false); // Reset error
    fetchResults(); // Fetch the results for analysis
  }
};

  // Function to remove a result from view
  const handleDeleteResult = () => {
    setResults(null); // Clear the result from view
  };

  return (
    <div className=" bg-[#F9F8F6] flex flex-col items-center md:justify-between justify-start text-center px-[24px] max-w-[1440px] mx-auto md:h-[120vh]">
     <div className="mx-auto flex flex-col items-center md:mb-0 mb-[64px]">
      <div className="max-w-[674px] mx-auto md:mt-[133px] mt-[61px]">
        <Image 
        src={logo}
        alt="logo"
        width={222.79}
        height={24}
        className="mb-[64px] md:mx-auto"
        />
       <h1 className="text-[8vw] md:text-[36px] font-bold leading-[9vw] md:leading-[43.57px] mb-4 text-[#333333] font-inter">Get your content SERP rank for a keyword</h1>
        <p className="text-[#767676] mb-[42px] text-[4vw] md:text-[16px] font-normal leading-[5vw] md:leading-[19.36px] tracking-[1.5%] w-full md:max-w-[536px] mx-auto">Check what position your content has on Google search for a particular keyword in a country or globally.</p>

      </div>
        {/* URL Input */}
      <div className="md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative focus-within:p-[2px] rounded-[42px] focus-within:bg-gradient-to-r from-[#7F1AFF66] to-[#FF990066] w-full md:w-[full] max-w-[404px]">
          <div className="bg-[#F9F8F6] rounded-[42px] border-[2px] focus-within:border-[0px] ">
            <input
              type="text"
              required
              placeholder="Content/article link"
              value={url}
              onChange={handleUrlChange}
              className={`border-[0.25px] border-[#DFDFDF] rounded-[41px] py-2 px-[18px] w-[330px] md:w-[400px]  bg-[#F0EEE8] text-[#333333] text-[16px] leading-[19.36px] font-medium placeholder-[#C2C2C2] outline-none search-bar h-[32px] ${isUrlValid ? "" : "border-red-500"}`}
            />
           
          </div>
          
        </div>
        {!isUrlValid && (
            <p className="text-red-500 text-base font-medium mt-[7px]">Please enter a valid URL</p>
             )}
      </div>

       {/* Country Selection */}
       <div className="border-[2px] rounded-[42px] bg-[#F0EEE8] mt-[10px] max-w-[404px] select-container">
          <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="rounded-[34px] bg-[#F0EEE8] text-[#0B0B0B] text-[14px] leading-[16.94px] font-medium placeholder-[#C2C2C2] outline-none py-2 px-[18px] w-[330px] md:w-[400px] button-shadow custom-select h-[32px]"
        >
          <option value="" className="text-[#C2C2C2] custom-select">Country (Optional)</option>
          <option value="Afghanistan">Afghanistan</option>
                <option value="Åland Islands">Åland Islands</option>
                <option value="Albania">Albania</option>
                <option value="Algeria">Algeria</option>
                <option value="American Samoa">American Samoa</option>
                <option value="Andorra">Andorra</option>
                <option value="Angola">Angola</option>
                <option value="Anguilla">Anguilla</option>
                <option value="Antarctica">Antarctica</option>
                <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                <option value="Argentina">Argentina</option>
                <option value="Armenia">Armenia</option>
                <option value="Aruba">Aruba</option>
                <option value="Australia">Australia</option>
                <option value="Austria">Austria</option>
                <option value="Azerbaijan">Azerbaijan</option>
                <option value="Bahamas">Bahamas</option>
                <option value="Bahrain">Bahrain</option>
                <option value="Bangladesh">Bangladesh</option>
                <option value="Barbados">Barbados</option>
                <option value="Belarus">Belarus</option>
                <option value="Belgium">Belgium</option>
                <option value="Belize">Belize</option>
                <option value="Benin">Benin</option>
                <option value="Bermuda">Bermuda</option>
                <option value="Bhutan">Bhutan</option>
                <option value="Bolivia">Bolivia</option>
                <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                <option value="Botswana">Botswana</option>
                <option value="Bouvet Island">Bouvet Island</option>
                <option value="Brazil">Brazil</option>
                <option value="British Indian Ocean Territory">British Indian Ocean Territory</option>
                <option value="Brunei Darussalam">Brunei Darussalam</option>
                <option value="Bulgaria">Bulgaria</option>
                <option value="Burkina Faso">Burkina Faso</option>
                <option value="Burundi">Burundi</option>
                <option value="Cambodia">Cambodia</option>
                <option value="Cameroon">Cameroon</option>
                <option value="Canada">Canada</option>
                <option value="Cape Verde">Cape Verde</option>
                <option value="Cayman Islands">Cayman Islands</option>
                <option value="Central African Republic">Central African Republic</option>
                <option value="Chad">Chad</option>
                <option value="Chile">Chile</option>
                <option value="China">China</option>
                <option value="Christmas Island">Christmas Island</option>
                <option value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option>
                <option value="Colombia">Colombia</option>
                <option value="Comoros">Comoros</option>
                <option value="Congo">Congo</option>
                <option value="Congo, The Democratic Republic of The">Congo, The Democratic Republic of The</option>
                <option value="Cook Islands">Cook Islands</option>
                <option value="Costa Rica">Costa Rica</option>
                <option value="Cote D'ivoire">Cote D&apos;ivoire</option>
                <option value="Croatia">Croatia</option>
                <option value="Cuba">Cuba</option>
                <option value="Cyprus">Cyprus</option>
                <option value="Czech Republic">Czech Republic</option>
                <option value="Denmark">Denmark</option>
                <option value="Djibouti">Djibouti</option>
                <option value="Dominica">Dominica</option>
                <option value="Dominican Republic">Dominican Republic</option>
                <option value="Ecuador">Ecuador</option>
                <option value="Egypt">Egypt</option>
                <option value="El Salvador">El Salvador</option>
                <option value="Equatorial Guinea">Equatorial Guinea</option>
                <option value="Eritrea">Eritrea</option>
                <option value="Estonia">Estonia</option>
                <option value="Ethiopia">Ethiopia</option>
                <option value="Falkland Islands (Malvinas)">Falkland Islands (Malvinas)</option>
                <option value="Faroe Islands">Faroe Islands</option>
                <option value="Fiji">Fiji</option>
                <option value="Finland">Finland</option>
                <option value="France">France</option>
                <option value="French Guiana">French Guiana</option>
                <option value="French Polynesia">French Polynesia</option>
                <option value="French Southern Territories">French Southern Territories</option>
                <option value="Gabon">Gabon</option>
                <option value="Gambia">Gambia</option>
                <option value="Georgia">Georgia</option>
                <option value="Germany">Germany</option>
                <option value="Ghana">Ghana</option>
                <option value="Gibraltar">Gibraltar</option>
                <option value="Greece">Greece</option>
                <option value="Greenland">Greenland</option>
                <option value="Grenada">Grenada</option>
                <option value="Guadeloupe">Guadeloupe</option>
                <option value="Guam">Guam</option>
                <option value="Guatemala">Guatemala</option>
                <option value="Guernsey">Guernsey</option>
                <option value="Guinea">Guinea</option>
                <option value="Guinea-bissau">Guinea-bissau</option>
                <option value="Guyana">Guyana</option>
                <option value="Haiti">Haiti</option>
                <option value="Heard Island and Mcdonald Islands">Heard Island and Mcdonald Islands</option>
                <option value="Holy See (Vatican City State)">Holy See (Vatican City State)</option>
                <option value="Honduras">Honduras</option>
                <option value="Hong Kong">Hong Kong</option>
                <option value="Hungary">Hungary</option>
                <option value="Iceland">Iceland</option>
                <option value="India">India</option>
                <option value="Indonesia">Indonesia</option>
                <option value="Iran, Islamic Republic of">Iran, Islamic Republic of</option>
                <option value="Iraq">Iraq</option>
                <option value="Ireland">Ireland</option>
                <option value="Isle of Man">Isle of Man</option>
                <option value="Israel">Israel</option>
                <option value="Italy">Italy</option>
                <option value="Jamaica">Jamaica</option>
                <option value="Japan">Japan</option>
                <option value="Jersey">Jersey</option>
                <option value="Jordan">Jordan</option>
                <option value="Kazakhstan">Kazakhstan</option>
                <option value="Kenya">Kenya</option>
                <option value="Kiribati">Kiribati</option>
                <option value="Korea, Democratic People's Republic of">Korea, Democratic People&apos;s Republic of</option>
                <option value="Korea, Republic of">Korea, Republic of</option>
                <option value="Kuwait">Kuwait</option>
                <option value="Kyrgyzstan">Kyrgyzstan</option>
                <option value="Lao People's Democratic Republic">Lao People&apos;s Democratic Republic</option>
                <option value="Latvia">Latvia</option>
                <option value="Lebanon">Lebanon</option>
                <option value="Lesotho">Lesotho</option>
                <option value="Liberia">Liberia</option>
                <option value="Libyan Arab Jamahiriya">Libyan Arab Jamahiriya</option>
                <option value="Liechtenstein">Liechtenstein</option>
                <option value="Lithuania">Lithuania</option>
                <option value="Luxembourg">Luxembourg</option>
                <option value="Macao">Macao</option>
                <option value="Macedonia, The Former Yugoslav Republic of">Macedonia, The Former Yugoslav Republic of</option>
                <option value="Madagascar">Madagascar</option>
                <option value="Malawi">Malawi</option>
                <option value="Malaysia">Malaysia</option>
                <option value="Maldives">Maldives</option>
                <option value="Mali">Mali</option>
                <option value="Malta">Malta</option>
                <option value="Marshall Islands">Marshall Islands</option>
                <option value="Martinique">Martinique</option>
                <option value="Mauritania">Mauritania</option>
                <option value="Mauritius">Mauritius</option>
                <option value="Mayotte">Mayotte</option>
                <option value="Mexico">Mexico</option>
                <option value="Micronesia, Federated States of">Micronesia, Federated States of</option>
                <option value="Moldova, Republic of">Moldova, Republic of</option>
                <option value="Monaco">Monaco</option>
                <option value="Mongolia">Mongolia</option>
                <option value="Montenegro">Montenegro</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Morocco">Morocco</option>
                <option value="Mozambique">Mozambique</option>
                <option value="Myanmar">Myanmar</option>
                <option value="Namibia">Namibia</option>
                <option value="Nauru">Nauru</option>
                <option value="Nepal">Nepal</option>
                <option value="Netherlands">Netherlands</option>
                <option value="Netherlands Antilles">Netherlands Antilles</option>
                <option value="New Caledonia">New Caledonia</option>
                <option value="New Zealand">New Zealand</option>
                <option value="Nicaragua">Nicaragua</option>
                <option value="Niger">Niger</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Niue">Niue</option>
                <option value="Norfolk Island">Norfolk Island</option>
                <option value="Northern Mariana Islands">Northern Mariana Islands</option>
                <option value="Norway">Norway</option>
                <option value="Oman">Oman</option>
                <option value="Pakistan">Pakistan</option>
                <option value="Palau">Palau</option>
                <option value="Palestinian Territory, Occupied">Palestinian Territory, Occupied</option>
                <option value="Panama">Panama</option>
                <option value="Papua New Guinea">Papua New Guinea</option>
                <option value="Paraguay">Paraguay</option>
                <option value="Peru">Peru</option>
                <option value="Philippines">Philippines</option>
                <option value="Pitcairn">Pitcairn</option>
                <option value="Poland">Poland</option>
                <option value="Portugal">Portugal</option>
                <option value="Puerto Rico">Puerto Rico</option>
                <option value="Qatar">Qatar</option>
                <option value="Reunion">Reunion</option>
                <option value="Romania">Romania</option>
                <option value="Russian Federation">Russian Federation</option>
                <option value="Rwanda">Rwanda</option>
                <option value="Saint Helena">Saint Helena</option>
                <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                <option value="Saint Lucia">Saint Lucia</option>
                <option value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>
                <option value="Saint Vincent and The Grenadines">Saint Vincent and The Grenadines</option>
                <option value="Samoa">Samoa</option>
                <option value="San Marino">San Marino</option>
                <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="Senegal">Senegal</option>
                <option value="Serbia">Serbia</option>
                <option value="Seychelles">Seychelles</option>
                <option value="Sierra Leone">Sierra Leone</option>
                <option value="Singapore">Singapore</option>
                <option value="Slovakia">Slovakia</option>
                <option value="Slovenia">Slovenia</option>
                <option value="Solomon Islands">Solomon Islands</option>
                <option value="Somalia">Somalia</option>
                <option value="South Africa">South Africa</option>
                <option value="South Georgia and The South Sandwich Islands">South Georgia and The South Sandwich Islands</option>
                <option value="Spain">Spain</option>
                <option value="Sri Lanka">Sri Lanka</option>
                <option value="Sudan">Sudan</option>
                <option value="Suriname">Suriname</option>
                <option value="Svalbard and Jan Mayen">Svalbard and Jan Mayen</option>
                <option value="Swaziland">Swaziland</option>
                <option value="Sweden">Sweden</option>
                <option value="Switzerland">Switzerland</option>
                <option value="Syrian Arab Republic">Syrian Arab Republic</option>
                <option value="Taiwan">Taiwan</option>
                <option value="Tajikistan">Tajikistan</option>
                <option value="Tanzania, United Republic of">Tanzania, United Republic of</option>
                <option value="Thailand">Thailand</option>
                <option value="Timor-leste">Timor-leste</option>
                <option value="Togo">Togo</option>
                <option value="Tokelau">Tokelau</option>
                <option value="Tonga">Tonga</option>
                <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                <option value="Tunisia">Tunisia</option>
                <option value="Turkey">Turkey</option>
                <option value="Turkmenistan">Turkmenistan</option>
                <option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
                <option value="Tuvalu">Tuvalu</option>
                <option value="Uganda">Uganda</option>
                <option value="Ukraine">Ukraine</option>
                <option value="United Arab Emirates">United Arab Emirates</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="United States">United States</option>
                <option value="United States Minor Outlying Islands">United States Minor Outlying Islands</option>
                <option value="Uruguay">Uruguay</option>
                <option value="Uzbekistan">Uzbekistan</option>
                <option value="Vanuatu">Vanuatu</option>
                <option value="Venezuela">Venezuela</option>
                <option value="Viet Nam">Viet Nam</option>
                <option value="Virgin Islands, British">Virgin Islands, British</option>
                <option value="Virgin Islands, U.S.">Virgin Islands, U.S.</option>
                <option value="Wallis and Futuna">Wallis and Futuna</option>
                <option value="Western Sahara">Western Sahara</option>
                <option value="Yemen">Yemen</option>
                <option value="Zambia">Zambia</option>
                <option value="Zimbabwe">Zimbabwe</option>
        </select>
      </div>

      {/* Keyword Input */}
      <div className="mt-[10px] max-w-[404px] flex flex-col items-center space-y-2 border-[#D9D9D9] ">
        <div className="flex gap-[12px] md:w-auto">
          <div className="border-[2px] rounded-[42px] border-[#F0EEE8] w-auto md:w-auto">
          <input
            type="text"
            placeholder="Keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="border-[0.25px] border-[#DFDFDF] bg-[#F0EEE8] text-[#0B0B0B] !important rounded-[34px] py-2 px-[18px] w-[330px] md:w-[404px] button-shadow outline-none placeholder-[#C2C2C2] h-[32px] text-[14px] font-medium leading-[16.94px]"
          />
          </div>
          {/* <button
            onClick={handleAddKeyword}
            className="py-2 px-2 rounded-[43px] bg-[#333333] text-[#F9F9F7] flex gap-[8px] items-center w-auto md:w-auto"
          >
            <Image src={plus} alt="addition sign" />
            <p className="pr-[4px]">Add</p>
          </button> */}
        </div>
      </div>


    {/* Handle analysis */}
    <div className="md:block hidden mt-[32px]">
      <button
          onClick={handleAnalyze}
          className={`py-2 px-6 rounded-[34px] flex items-center gap-[8px] font-semibold text-[16px] leading-[19.36px] button-shadow border-[2px] text-[#767676] outline-none ${
            isAnalyzing ? "bg-none text-[#767676] analyzing-text " : "bg-gradient-to-r from-[#7F1AFF] to-[#FF9900] text-[#F9F8F6]"
          }  md:w-auto`}
        >
          <Image
            src={isAnalyzing ? spin : bolt}
            alt={isAnalyzing ? "Analyzing icon" : "Analyze icon"}
            width={16}
            height={16}
          />
          {isAnalyzing ? "Analysing..." : "Analyse"}
        </button>
      </div>

      <div className="md:hidden block mt-[44px]">
        <button
          onClick={handleAnalyze}
          className={`py-[13px] px-[40px] rounded-[34px] flex items-center gap-[8px] font-semibold text-[18px] leading-[19.36px] button-shadow border-[2px] text-[#767676] outline-none  ${
            isAnalyzing ? "bg-none text-[#767676] analyzing-text " : "bg-gradient-to-r from-[#7F1AFF] to-[#FF9900] text-[#F9F8F6]"
          }  md:w-auto`}
        >
          <Image
            src={isAnalyzing ? spin : bolt}
            alt={isAnalyzing ? "Analyzing icon" : "Analyze icon"}
            width={16}
            height={16}
          />
          {isAnalyzing ? "Analysing..." : "Analyse"}
        </button>
      </div>
      </div>

      {/* Display Results */}
      {keywordError && <p className="text-red-500 mt-2">Please enter a URL and a keyword.</p>}
      {results && (
  <div className="relative">
    <div className="mt-8 px-[26px] py-[32px] border-[0.5px] border-[#9292921A] rounded-[32px] bg-[#F7F6F3] relative max-w-[343px]">
      <Image 
        src={resultIcon}
        width={28}
        height={28}
        alt="your ranking"
        className="max-w-[30px] mx-auto mb-[8px]"
      />
      <h2 className="text-[20px] text-[#333333] leading-[24.2px] font-semibold mb-[32px]">Results</h2>
      {results.keywords.map((result, index) => (
        <div key={index} className="text-[#0B0B0B]">
          <div className="font-medium text-sm text-[#929292] leading-[16.94px] flex justify-center mb-[14px] items-center">
            Website: 
            <p className="text-[#0B0B0B] ml-[12px] py-[7px] px-[12px] border-[#9292921A] border-[0.5px] rounded-[22px]">
              {results.website}
            </p>
          </div>
          <div className="font-medium text-sm text-[#929292] leading-[16.94px] flex justify-center mb-[14px] items-center">
            Keyword: 
            <p className="text-[#0B0B0B] ml-[12px] py-[7px] px-[12px] border-[#9292921A] border-[0.5px] rounded-[22px]">
              {result.keyword}
            </p>
          </div>
          <div className="font-medium text-sm text-[#929292] leading-[16.94px] flex justify-center mb-[14px] items-center">
            Country:
            <p className="text-[#0B0B0B] ml-[12px] py-[7px] px-[12px] border-[#9292921A] border-[0.5px] rounded-[22px]">
              {result.country || "Not specified"}
            </p>
          </div>

          <div className="font-medium text-sm text-[#929292] leading-[16.94px] flex justify-center mb-[14px] items-center">
          Ranking:
          <p className="text-[#0B0B0B] ml-[12px] py-[7px] px-[12px] border-[#9292921A] border-[0.5px] rounded-[22px]">
              {result.ranking === null || result.ranking === undefined ? 'No ranking found' : result.ranking}
            </p>
          </div>
        </div>
      ))}
        {/* Delete button */}
        <button
                onClick={handleDeleteResult}
                className="absolute top-[16px] right-[16px] text-red-500 hover:text-red-700"
              >
                <Image 
                  src={trash}
                  alt="trash icon"
                  width={26}
                  height={26}
                />
        </button>
    </div>
  </div>
)}

{/* <div className="px-[26px] py-[22px] border-[0.5px] border-[#9292921A] rounded-[32px] bg-[#F7F6F3] relative mb-[100px] mt-[23px] max-w-[343px]">
  <div className="flex flex-col gap-[18px] items-center">
    <p className="text-[#434343] text-[16px] leading-[19.36px] font-[500] tracking-[1.5%]">
      Want content that ranks better?
    </p>
    <div className="text-[#434343] text-[14px] leading-[16.94px] font-medium flex items-center gap-[8px]">
    Check out 
    <a href="https://hackmamba.io">
    <Image 
    src={mambaLogo}
    width={131}
    height={24}
    alt="Hackmamba logo"
    />
    </a>
    </div>
  </div>
  </div> */}



    <div className="relative md:sticky bottom-0 w-full">
    {/* Gradient */}
    <div className="relative md:relative inset-0 w-full h-[150px] bg-gradient-to-r from-[#7F1AFF] to-[#FF9900] blur-3xl opacity-[35%] z-10  top-[29%] md:mb-0 mb-[-62px]"></div>

    {/* Copyright Text */}
    <div className="text-center text-[#323232] w-full text-xs py-2 pb-[34px] z-30 relative text-[10px] leading-[12.1px] tracking-[1.5%] font-normal">
      © RankRite_ 2024 • All rights reserved
    </div>

    {/* Horizontal Line */}
    <div className="md:w-[105%] w-[135%] relative md:left-[-25px] left-[-25px] h-[8px] bg-gradient-to-r from-[#7F1AFF] to-[#FF9900] z-20"></div>
  </div>



    </div>
  );
}
