/**
 * TRUCK RESCUE INDIA - India-Wide Geographic Hierarchy
 * Comprehensive dataset covering all 28 States and 8 Union Territories (36 Total)
 * Includes major freight corridors, transport hubs, and commercial vehicle districts.
 */

export interface IndianStateInfo {
  name: string;
  code: string; // Official 2-letter RTO / ISO state code (e.g. MH, DL, GJ)
  isUT: boolean;
  majorTransportHubs: string[];
  districts: string[];
}

export const ALL_INDIAN_STATES_DATA: IndianStateInfo[] = [
  // --- 28 STATES ---
  {
    name: 'Andhra Pradesh',
    code: 'AP',
    isUT: false,
    majorTransportHubs: ['Vijayawada', 'Visakhapatnam', 'Tirupati', 'Guntur', 'Kurnool', 'Nellore'],
    districts: [
      'Alluri Sitharama Raju', 'Anakapalli', 'Ananthapuramu', 'Annamayya', 'Bapatla', 
      'Chittoor', 'Dr. B.R. Ambedkar Konaseema', 'East Godavari', 'Eluru', 'Guntur', 
      'Kakinada', 'Krishna', 'Kurnool', 'Nandyal', 'NTR (Vijayawada)', 'Palnadu', 
      'Parvathipuram Manyam', 'Prakasam', 'Sri Potti Sriramulu Nellore', 'Sri Sathya Sai', 
      'Srikakulam', 'Tirupati', 'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR Kadapa'
    ]
  },
  {
    name: 'Arunachal Pradesh',
    code: 'AR',
    isUT: false,
    majorTransportHubs: ['Itanagar', 'Pasighat', 'Bhalukpong', 'Naharlagun'],
    districts: [
      'Anjaw', 'Changlang', 'Dibang Valley', 'East Kameng', 'East Siang', 'Kamle', 
      'Kra Daadi', 'Kurung Kumey', 'Lepa Rada', 'Lohit', 'Longding', 'Lower Dibang Valley', 
      'Lower Siang', 'Lower Subansiri', 'Namsai', 'Pakke Kessang', 'Papum Pare', 'Shi Yomi', 
      'Siang', 'Tawang', 'Tirap', 'Upper Siang', 'Upper Subansiri', 'West Kameng', 'West Siang'
    ]
  },
  {
    name: 'Assam',
    code: 'AS',
    isUT: false,
    majorTransportHubs: ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Bongaigaon', 'Tezpur'],
    districts: [
      'Baksa', 'Barpeta', 'Biswanath', 'Bongaigaon', 'Cachar', 'Charaideo', 'Chirang', 
      'Darrang', 'Dhemaji', 'Dhubri', 'Dibrugarh', 'Dima Hasao', 'Goalpara', 'Golaghat', 
      'Hailakandi', 'Hojai', 'Jorhat', 'Kamrup', 'Kamrup Metropolitan (Guwahati)', 'Karbi Anglong', 
      'Karimganj', 'Kokrajhar', 'Lakhimpur', 'Majuli', 'Morigaon', 'Nagaon', 'Nalbari', 
      'Sivasagar', 'Sonitpur', 'South Salmara-Mankachar', 'Tinsukia', 'Udalguri', 'West Karbi Anglong'
    ]
  },
  {
    name: 'Bihar',
    code: 'BR',
    isUT: false,
    majorTransportHubs: ['Patna', 'Muzaffarpur', 'Gaya', 'Bhagalpur', 'Purnia', 'Darbhanga', 'Begusarai'],
    districts: [
      'Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 
      'Buxar', 'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 
      'Kaimur', 'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura', 'Madhubani', 
      'Munger', 'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia', 'Rohtas', 'Saharsa', 
      'Samastipur', 'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul', 
      'Vaishali', 'West Champaran'
    ]
  },
  {
    name: 'Chhattisgarh',
    code: 'CG',
    isUT: false,
    majorTransportHubs: ['Raipur', 'Bilaspur', 'Durg-Bhilai', 'Korba', 'Rajnandgaon', 'Jagdalpur'],
    districts: [
      'Balod', 'Baloda Bazar', 'Balrampur', 'Bastar', 'Bemetara', 'Bijapur', 'Bilaspur', 
      'Dantewada', 'Dhamtari', 'Durg', 'Gariaband', 'Gaurela-Pendra-Marwahi', 'Janjgir-Champa', 
      'Jashpur', 'Kabirdham', 'Kanker', 'Khairagarh-Chhuikhadan-Gandai', 'Kondagaon', 'Korba', 
      'Koriya', 'Mahasamund', 'Manendragarh-Chirmiri-Bharatpur', 'Mohla-Manpur-Ambagarh Chowki', 
      'Mungeli', 'Narayanpur', 'Raigarh', 'Raipur', 'Rajnandgaon', 'Sarangarh-Bilaigarh', 
      'Sakti', 'Sukma', 'Surajpur', 'Surguja'
    ]
  },
  {
    name: 'Goa',
    code: 'GA',
    isUT: false,
    majorTransportHubs: ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda'],
    districts: ['North Goa', 'South Goa']
  },
  {
    name: 'Gujarat',
    code: 'GJ',
    isUT: false,
    majorTransportHubs: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhidham', 'Mundra', 'Kandla', 'Bharuch', 'Vapi', 'Morbi'],
    districts: [
      'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 'Bhavnagar', 
      'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhoomi Dwarka', 'Gandhinagar', 
      'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch', 'Mahisagar', 'Mehsana', 
      'Morbi', 'Narmada', 'Navsari', 'Panchmahal', 'Patan', 'Porbandar', 'Rajkot', 
      'Sabarkantha', 'Surat', 'Surendranagar', 'Tapi', 'Vadodara', 'Valsad'
    ]
  },
  {
    name: 'Haryana',
    code: 'HR',
    isUT: false,
    majorTransportHubs: ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Hisar', 'Karnal', 'Rohtak', 'Rewari', 'Kundli'],
    districts: [
      'Ambala', 'Bhiwani', 'Charkhi Dadri', 'Faridabad', 'Fatehabad', 'Gurugram', 
      'Hisar', 'Jhajjar', 'Jind', 'Kaithal', 'Karnal', 'Kurukshetra', 'Mahendragarh', 
      'Nuh', 'Palwal', 'Panchkula', 'Panipat', 'Rewari', 'Rohtak', 'Sirsa', 'Sonipat', 'Yamunanagar'
    ]
  },
  {
    name: 'Himachal Pradesh',
    code: 'HP',
    isUT: false,
    majorTransportHubs: ['Baddi', 'Solan', 'Shimla', 'Kullu-Manali', 'Kala Amb', 'Una', 'Mandi'],
    districts: [
      'Bilaspur', 'Chamba', 'Hamirpur', 'Kangra', 'Kinnaur', 'Kullu', 
      'Lahaul and Spiti', 'Mandi', 'Shimla', 'Sirmaur', 'Solan', 'Una'
    ]
  },
  {
    name: 'Jharkhand',
    code: 'JH',
    isUT: false,
    majorTransportHubs: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Hazaribagh', 'Deoghar', 'Ramgarh'],
    districts: [
      'Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum (Jamshedpur)', 
      'Garhwa', 'Giridih', 'Godda', 'Gumla', 'Hazaribagh', 'Jamtara', 'Khunti', 'Koderma', 
      'Latehar', 'Lohardaga', 'Pakur', 'Palamu', 'Ramgarh', 'Ranchi', 'Sahebganj', 
      'Seraikela Kharsawan', 'Simdega', 'West Singhbhum'
    ]
  },
  {
    name: 'Karnataka',
    code: 'KA',
    isUT: false,
    majorTransportHubs: ['Bengaluru', 'Hubballi-Dharwad', 'Belagavi', 'Mangaluru', 'Mysuru', 'Kalaburagi', 'Davangere', 'Tumakuru', 'Hosapete'],
    districts: [
      'Bagalkote', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban', 'Bidar', 
      'Chamarajanagara', 'Chikkaballapura', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada', 
      'Davanagere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri', 'Kalaburagi', 'Kodagu', 'Kolar', 
      'Koppal', 'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga', 'Tumakuru', 
      'Udupi', 'Uttara Kannada', 'Vijayanagara', 'Vijayapura', 'Yadgir'
    ]
  },
  {
    name: 'Kerala',
    code: 'KL',
    isUT: false,
    majorTransportHubs: ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Palakkad', 'Kollam', 'Kannur', 'Alappuzha'],
    districts: [
      'Alappuzha', 'Ernakulam (Kochi)', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam', 
      'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta', 
      'Thiruvananthapuram', 'Thrissur', 'Wayanad'
    ]
  },
  {
    name: 'Madhya Pradesh',
    code: 'MP',
    isUT: false,
    majorTransportHubs: ['Indore', 'Bhopal', 'Gwalior', 'Jabalpur', 'Ujjain', 'Dewas', 'Pithampur', 'Sagar', 'Satna', 'Ratlam'],
    districts: [
      'Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 'Barwani', 'Betul', 
      'Bhind', 'Bhopal', 'Burhanpur', 'Chhatarpur', 'Chhindwara', 'Damoh', 'Datia', 'Dewas', 
      'Dhar', 'Dindori', 'Guna', 'Gwalior', 'Harda', 'Hoshangabad (Narmadapuram)', 'Indore', 
      'Jabalpur', 'Jhabua', 'Katni', 'Khandwa', 'Khargone', 'Mandla', 'Mandsaur', 'Morena', 
      'Narsinghpur', 'Neemuch', 'Niwari', 'Panna', 'Raisen', 'Rajgarh', 'Ratlam', 'Rewa', 
      'Sagar', 'Satna', 'Sehore', 'Seoni', 'Shahdol', 'Shajapur', 'Sheopur', 'Shivpuri', 
      'Sidhi', 'Singrauli', 'Tikamgarh', 'Ujjain', 'Umaria', 'Vidisha'
    ]
  },
  {
    name: 'Maharashtra',
    code: 'MH',
    isUT: false,
    majorTransportHubs: ['Bhiwandi', 'JNPT Navi Mumbai', 'Pune-Chakan', 'Nagpur Logistics Hub', 'Nashik', 'Thane', 'Kolhapur', 'Solapur', 'Aurangabad', 'Dhule-NH52', 'Panvel'],
    districts: [
      'Ahmednagar', 'Akola', 'Amravati', 'Chhatrapati Sambhajinagar (Aurangabad)', 'Beed', 
      'Bhandara', 'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 
      'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 
      'Nanded', 'Nandurbar', 'Nashik', 'Dharashiv (Osmanabad)', 'Palghar', 'Parbhani', 
      'Pune', 'Raigad (Panvel/JNPT)', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 
      'Solapur', 'Thane (Bhiwandi)', 'Wardha', 'Washim', 'Yavatmal'
    ]
  },
  {
    name: 'Manipur',
    code: 'MN',
    isUT: false,
    majorTransportHubs: ['Imphal', 'Moreh Indo-Myanmar Border', 'Churachandpur', 'Senapati'],
    districts: [
      'Bishnupur', 'Chandel', 'Churachandpur', 'Imphal East', 'Imphal West', 'Jiribam', 
      'Kakching', 'Kamjong', 'Kangpokpi', 'Noney', 'Pherzawl', 'Senapati', 'Tamenglong', 
      'Tengnoupal', 'Thoubal', 'Ukhrul'
    ]
  },
  {
    name: 'Meghalaya',
    code: 'ML',
    isUT: false,
    majorTransportHubs: ['Shillong', 'Byrnihat Industrial Corridor', 'Tura', 'Jowai', 'Nongpoh'],
    districts: [
      'East Garo Hills', 'East Jaintia Hills', 'East Khasi Hills', 'Eastern West Khasi Hills', 
      'North Garo Hills', 'Ri Bhoi', 'South Garo Hills', 'South West Garo Hills', 
      'South West Khasi Hills', 'West Garo Hills', 'West Jaintia Hills', 'West Khasi Hills'
    ]
  },
  {
    name: 'Mizoram',
    code: 'MZ',
    isUT: false,
    majorTransportHubs: ['Aizawl', 'Lunglei', 'Champhai', 'Kolasib (NH-306)'],
    districts: [
      'Aizawl', 'Champhai', 'Hnahthial', 'Khawzawl', 'Kolasib', 'Lawngtlai', 
      'Lunglei', 'Mamit', 'Saitual', 'Serchhip', 'Siaha'
    ]
  },
  {
    name: 'Nagaland',
    code: 'NL',
    isUT: false,
    majorTransportHubs: ['Dimapur (Railway & Freight Hub)', 'Kohima', 'Mokokchung', 'Wokha'],
    districts: [
      'Chümoukedima', 'Dimapur', 'Kiphire', 'Kohima', 'Longleng', 'Mokokchung', 
      'Mon', 'Niuland', 'Noklak', 'Peren', 'Phek', 'Shamator', 'Tseminyü', 'Tuensang', 'Wokha', 'Zünheboto'
    ]
  },
  {
    name: 'Odisha',
    code: 'OD',
    isUT: false,
    majorTransportHubs: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Paradeep Port', 'Jharsuguda', 'Sambalpur', 'Balasore', 'Berhampur', 'Angul'],
    districts: [
      'Angul', 'Balangir', 'Balasore', 'Bargarh', 'Bhadrak', 'Boudh', 'Cuttack', 
      'Deogarh', 'Dhenkanal', 'Gajapati', 'Ganjam', 'Jagatsinghpur', 'Jajpur', 'Jharsuguda', 
      'Kalahandi', 'Kandhamal', 'Kendrapara', 'Kendujhar (Keonjhar)', 'Khordha (Bhubaneswar)', 
      'Koraput', 'Malkangiri', 'Mayurbhanj', 'Nabarangpur', 'Nayagarh', 'Nuapada', 'Puri', 
      'Rayagada', 'Sambalpur', 'Subarnapur', 'Sundargarh'
    ]
  },
  {
    name: 'Punjab',
    code: 'PB',
    isUT: false,
    majorTransportHubs: ['Ludhiana (Transport Capital)', 'Amritsar', 'Jalandhar', 'Bathinda', 'Patiala', 'Mohali', 'Phagwara', 'Mandi Gobindgarh'],
    districts: [
      'Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 'Fazilka', 
      'Ferozepur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Ludhiana', 
      'Malerkotla', 'Mansa', 'Moga', 'Muktsar', 'Pathankot', 'Patiala', 'Rupnagar', 
      'Sahibzada Ajit Singh Nagar (Mohali)', 'Sangrur', 'Shahid Bhagat Singh Nagar', 'Tarn Taran'
    ]
  },
  {
    name: 'Rajasthan',
    code: 'RJ',
    isUT: false,
    majorTransportHubs: ['Jaipur', 'Jodhpur', 'Kota', 'Udaipur', 'Bhilwara', 'Alwar', 'Bhiwadi', 'Ajmer', 'Bikaner', 'Kishangarh'],
    districts: [
      'Ajmer', 'Alwar', 'Anupgarh', 'Balotra', 'Banswara', 'Baran', 'Barmer', 'Beawar', 
      'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa', 
      'Deeg', 'Dholpur', 'Didwana-Kuchaman', 'Dudu', 'Gangapur City', 'Hanumangarh', 
      'Jaipur', 'Jaipur Rural', 'Jaisalmer', 'Jalore', 'Jhalawar', 'Jhunjhunu', 'Jodhpur', 
      'Jodhpur Rural', 'Karauli', 'Kekri', 'Khairthal-Tijara', 'Kota', 'Kotputli-Behror', 
      'Nagaur', 'Neem Ka Thana', 'Pali', 'Phalodi', 'Pratapgarh', 'Rajsamand', 
      'Salumbar', 'Sanchore', 'Sawai Madhopur', 'Shahpura', 'Sikar', 'Sirohi', 
      'Sri Ganganagar', 'Tonk', 'Udaipur'
    ]
  },
  {
    name: 'Sikkim',
    code: 'SK',
    isUT: false,
    majorTransportHubs: ['Gangtok', 'Rangpo (Entry Hub)', 'Singtam', 'Jorethang'],
    districts: ['Gangtok', 'Mangan', 'Namchi', 'Gyalshing', 'Pakyong', 'Soreng']
  },
  {
    name: 'Tamil Nadu',
    code: 'TN',
    isUT: false,
    majorTransportHubs: ['Chennai Port', 'Coimbatore Auto Hub', 'Namakkal (Truck Hub)', 'Salem', 'Madurai', 'Tiruchirappalli', 'Tirupur', 'Hosur', 'Tuticorin Port'],
    districts: [
      'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 
      'Dindigul', 'Erode', 'Kallakurichi', 'Kancheepuram', 'Kanyakumari', 'Karur', 
      'Krishnagiri (Hosur)', 'Madurai', 'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 
      'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 
      'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi (Tuticorin)', 
      'Tiruchirappalli', 'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tiruvallur', 
      'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'
    ]
  },
  {
    name: 'Telangana',
    code: 'TS',
    isUT: false,
    majorTransportHubs: ['Hyderabad-ORR', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Ramagundam', 'Suryapet-NH65', 'Adilabad-NH44'],
    districts: [
      'Adilabad', 'Bhadradri Kothagudem', 'Hanamkonda', 'Hyderabad', 'Jagtial', 
      'Jangaon', 'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar', 
      'Khammam', 'Kumuram Bheem Asifabad', 'Mahabubabad', 'Mahabubnagar', 'Mancherial', 
      'Medak', 'Medchal-Malkajgiri', 'Mulugu', 'Nagarkurnool', 'Nalgonda', 'Narayanpet', 
      'Nirmal', 'Nizamabad', 'Peddapalli', 'Rajanna Sircilla', 'Ranga Reddy', 'Sangareddy', 
      'Siddipet', 'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal', 'Yadadri Bhuvanagiri'
    ]
  },
  {
    name: 'Tripura',
    code: 'TR',
    isUT: false,
    majorTransportHubs: ['Agartala', 'Dharmanagar (Freight Rail)', 'Udaipur', 'Ambassa'],
    districts: [
      'Dhalai', 'Gomati', 'Khowai', 'North Tripura', 'Sepahijala', 'South Tripura', 
      'Unakoti', 'West Tripura'
    ]
  },
  {
    name: 'Uttar Pradesh',
    code: 'UP',
    isUT: false,
    majorTransportHubs: ['Kanpur (Transport Nagar)', 'Agra Expressway Hub', 'Varanasi-GT Road', 'Lucknow', 'Ghaziabad', 'Noida-Greater Noida', 'Prayagraj', 'Bareilly', 'Gorakhpur', 'Aligarh', 'Moradabad', 'Mathura'],
    districts: [
      'Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Ayodhya', 
      'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 
      'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 
      'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad', 
      'Gautam Buddha Nagar (Noida)', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 
      'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj', 
      'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kheri', 'Kushinagar', 
      'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau', 
      'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 
      'Prayagraj', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 
      'Shahjahanpur', 'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 
      'Sultanpur', 'Unnao', 'Varanasi'
    ]
  },
  {
    name: 'Uttarakhand',
    code: 'UK',
    isUT: false,
    majorTransportHubs: ['Dehradun', 'Haridwar-SIDCUL', 'Rudrapur-Pantnagar', 'Kashipur', 'Haldwani', 'Roorkee'],
    districts: [
      'Almora', 'Bageshwar', 'Chamoli', 'Champawat', 'Dehradun', 'Haridwar', 
      'Nainital', 'Pauri Garhwal', 'Pithoragarh', 'Rudraprayag', 'Tehri Garhwal', 
      'Udham Singh Nagar', 'Uttarkashi'
    ]
  },
  {
    name: 'West Bengal',
    code: 'WB',
    isUT: false,
    majorTransportHubs: ['Kolkata (Dankuni / Kona)', 'Asansol-Durgapur', 'Siliguri North-East Gateway', 'Kharagpur Freight Hub', 'Haldia Port'],
    districts: [
      'Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur', 'Darjeeling', 
      'Hooghly (Dankuni)', 'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong', 'Kolkata', 
      'Malda', 'Murshidabad', 'Nadia', 'North 24 Parganas', 'Paschim Bardhaman (Durgapur/Asansol)', 
      'Paschim Medinipur (Kharagpur)', 'Purba Bardhaman', 'Purba Medinipur (Haldia)', 
      'Purulia', 'South 24 Parganas', 'Uttar Dinajpur'
    ]
  },

  // --- 8 UNION TERRITORIES ---
  {
    name: 'Andaman and Nicobar Islands',
    code: 'AN',
    isUT: true,
    majorTransportHubs: ['Port Blair', 'Haddo Wharf', 'Diglipur'],
    districts: ['Nicobar', 'North and Middle Andaman', 'South Andaman']
  },
  {
    name: 'Chandigarh',
    code: 'CH',
    isUT: true,
    majorTransportHubs: ['Chandigarh Transport Area', 'Industrial Area Phase 1 & 2'],
    districts: ['Chandigarh']
  },
  {
    name: 'Dadra and Nagar Haveli and Daman and Diu',
    code: 'DN',
    isUT: true,
    majorTransportHubs: ['Silvassa Industrial Hub', 'Daman', 'Diu'],
    districts: ['Dadra and Nagar Haveli', 'Daman', 'Diu']
  },
  {
    name: 'Delhi NCR',
    code: 'DL',
    isUT: true,
    majorTransportHubs: ['Sanjay Gandhi Transport Nagar (SGTN)', 'Azadpur', 'Okhla Industrial Area', 'Mayapuri', 'Narela', 'Alipur / GT Karnal Road', 'Dhaula Kuan'],
    districts: [
      'Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi (SGTN)', 'North East Delhi', 
      'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi (Okhla)', 
      'South West Delhi', 'West Delhi (Mayapuri)'
    ]
  },
  {
    name: 'Jammu and Kashmir',
    code: 'JK',
    isUT: true,
    majorTransportHubs: ['Jammu (Narwal Yard)', 'Srinagar (Parimpora)', 'Anantnag', 'Udhampur (NH44)'],
    districts: [
      'Anantnag', 'Bandipora', 'Baramulla', 'Budgam', 'Doda', 'Ganderbal', 'Jammu', 
      'Kathua', 'Kishtwar', 'Kulgam', 'Kupwara', 'Poonch', 'Pulwama', 'Rajouri', 
      'Ramban', 'Reasi', 'Samba', 'Shopian', 'Srinagar', 'Udhampur'
    ]
  },
  {
    name: 'Ladakh',
    code: 'LA',
    isUT: true,
    majorTransportHubs: ['Leh', 'Kargil', 'Drass'],
    districts: ['Leh', 'Kargil']
  },
  {
    name: 'Lakshadweep',
    code: 'LD',
    isUT: true,
    majorTransportHubs: ['Kavaratti Port', 'Agatti'],
    districts: ['Lakshadweep']
  },
  {
    name: 'Puducherry',
    code: 'PY',
    isUT: true,
    majorTransportHubs: ['Puducherry Port Area', 'Karaikal Port', 'Mahe', 'Yanam'],
    districts: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam']
  }
];

/**
 * Returns names of all 36 Indian States and Union Territories sorted alphabetically
 */
export function getAllIndianStates(): string[] {
  return ALL_INDIAN_STATES_DATA.map(s => s.name).sort((a, b) => a.localeCompare(b));
}

/**
 * Returns state information object by state name
 */
export function getStateDetails(stateName: string): IndianStateInfo | undefined {
  if (!stateName) return undefined;
  const normalized = stateName.trim().toLowerCase();
  return ALL_INDIAN_STATES_DATA.find(s => s.name.toLowerCase() === normalized || s.code.toLowerCase() === normalized);
}

/**
 * Returns official 2-letter state code (e.g. MH, DL, GJ)
 */
export function getStateCode(stateName: string): string {
  const details = getStateDetails(stateName);
  return details ? details.code : 'IN';
}

/**
 * Returns list of districts for a given state
 */
export function getDistrictsByState(stateName: string): string[] {
  const details = getStateDetails(stateName);
  if (details && details.districts && details.districts.length > 0) {
    return [...details.districts].sort((a, b) => a.localeCompare(b));
  }
  return [];
}

/**
 * Returns major truck transport hubs for a given state
 */
export function getTransportHubsByState(stateName: string): string[] {
  const details = getStateDetails(stateName);
  return details ? details.majorTransportHubs : [];
}

/**
 * Validates a 6-digit Indian Postal PIN code
 */
export function isValidPincode(pincode: string): boolean {
  if (!pincode) return false;
  const clean = pincode.toString().trim();
  // Valid Indian PIN codes are exactly 6 digits, starting with 1-9 (0 is never first)
  return /^[1-9][0-9]{5}$/.test(clean);
}
