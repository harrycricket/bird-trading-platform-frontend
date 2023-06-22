import {
   Box,
   Button,
   ButtonGroup,
   FormHelperText,
   IconButton,
   Skeleton,
   TextField,
   Typography,
} from "@mui/material";
import s from "./mapControl.module.scss";
import {
   useJsApiLoader,
   GoogleMap,
   Marker,
   Autocomplete,
   DirectionsRenderer,
   useGoogleMap,
} from "@react-google-maps/api";
import clsx from "clsx";
import { useEffect } from "react";
import { useRef, useState } from "react";
const lib = ["places"];
const center = { lat: 48.8584, lng: 2.2945 };

function MapControl({ address, setAddress, w, h, triggerSave }) {
   const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: "AIzaSyApYxFyr-42__SnJKnFCSDBM34rpkopYnU",
      libraries: lib,
   });
   const [map, setMap] = useState(/** @type google.maps.Map */ (null));
   const [directionsResponse, setDirectionsResponse] = useState(null);
   const [distance, setDistance] = useState("");
   const [duration, setDuration] = useState("");
   const [origin, setOrigin] = useState("");
   const [destination, setDestination] = useState("");
   const [invalid, setInvalid] = useState("");
   const addrStatus = useRef({
      isValid: false,
      addr: "",
   });
   /** @type React.MutableRefObject<HTMLInputElement> */
   const originRef = useRef();
   /** @type React.MutableRefObject<HTMLInputElement> */
   const destiantionRef = useRef();
   useEffect(() => {
      console.log(originRef);
      if (originRef !== undefined && originRef.current !== undefined) {
      }
   }, []);

   useEffect(() => {
      if (triggerSave !== 0) {
         changeInfoAddress(originRef);
      }
   }, [triggerSave]);
   const changeInfoAddress = async (originRef) => {
      if (
         originRef?.current !== undefined &&
         originRef.current.value !== undefined
      ) {
         addrStatus.current.addr = originRef.current.value;
         await checkValidAddress(addrStatus, setAddress);
      } else {
      }
   };

   const checkValidAddress = async (addrStatus, setAddress) => {
      console.log(addrStatus);
      // eslint-disable-next-line no-undef
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
         {
            address: addrStatus.current.addr,
         },
         function (results, status) {
            // eslint-disable-next-line no-undef
            if (
               // eslint-disable-next-line no-undef
               status === google.maps.GeocoderStatus.OK &&
               results.length > 0
            ) {
               console.log(status, " successfully", results);
               // set it to the correct, formatted address if it's valid
               setAddress(results[0].formatted_address);
               setInvalid("");
            } else {
               addrStatus.current = {
                  addr: "",
                  isValid: false,
               };
               setInvalid(
                  "Invalid address! Consider utilizing autocompletion for better results."
               );
               console.log(status, " failed", results);
               // show an error if it's not
            }
         }
      );
   };
   async function calculateRoute() {
      if (originRef?.current?.value === "") {
         return;
      }

      // eslint-disable-next-line no-undef
      const directionsService = new google.maps.DirectionsService();
      console.log(originRef.current.value);
      const origin2 = await checkValidAddress(originRef?.current?.value);
      // const destination2 = await checkValidAddress(
      //    destiantionRef.current.value
      // );
      // const results = await directionsService.route({
      //    origin: originRef.current.value,
      //    destination: destiantionRef.current.value,
      //    // eslint-disable-next-line no-undef
      //    travelMode: google.maps.TravelMode.DRIVING,
      // });
      // console.log(results);
      // setDirectionsResponse(results);
      // setDistance(results.routes[0].legs[0].distance.text);
      // setDuration(results.routes[0].legs[0].duration.text);
   }

   function clearRoute() {
      setDirectionsResponse(null);
      setDistance("");
      setDuration("");
      originRef.current.value = "";
      destiantionRef.current.value = "";
   }
   const handleChage = (e) => {
      console.log(e.target.value);
      console.log(originRef?.current?.value, "origin ref");
   };
   if (!isLoaded) {
      return <Skeleton />;
   }
   const handleCancel = () => {
      originRef.current.value = address;
   };
   return (
      <Box
         sx={{
            display: "flex",
            flexDirection: "column",
            width: w,
            gap: 1,
         }}
         className={clsx(s.container)}
      >
         <Box sx={{ display: "flex", gap: 1 }}>
            <Box sx={{ flex: 1 }}>
               <Autocomplete onChange={handleChage} className={"autocomplete"}>
                  <TextField
                     inputRef={originRef}
                     defaultValue={address}
                     type="text"
                     onComplete={handleChage}
                     placeholder="Origin"
                     id="outlined-basic"
                     label="Enter Place"
                     variant="outlined"
                     sx={{
                        label: {
                           fontSize: "1.6rem",
                        },
                        input: {
                           fontSize: "1.6rem",
                        },
                        "& .MuiOutlinedInput-notchedOutline legend": {
                           fontSize: "1.2rem",
                        },
                     }}
                     error={invalid !== ""}
                     fullWidth
                  />
               </Autocomplete>
            </Box>
            <Box sx={{ flexShrink: 0, display: "flex", gap: 0.5 }}>
               <Button
                  variant="contained"
                  color="Accent8"
                  type="reset"
                  onClick={handleCancel}
                  sx={{ fontSize: "1.5rem" }}
               >
                  Cancel
               </Button>
            </Box>

            {/* <Typogr
            aphy>Distance: {distance} </Typogr>
            <Typography>Duration: {duration} </Typography>
            <IconButton
               aria-label="center back"
               isRound
               onClick={() => {
                  map.panTo(center);
                  map.setZoom(15);
               }} */}
         </Box>
         <FormHelperText
            error={invalid !== ""}
            sx={{ fontSize: "1.3rem", paddingBottom: "1rem" }}
         >
            {invalid}
         </FormHelperText>
         <Box sx={{ width: "100%", height: h }}>
            {/* Google Map Box */}
            <GoogleMap
               center={center}
               zoom={15}
               mapContainerStyle={{ width: "100%", height: "100%" }}
               options={{
                  zoomControl: false,
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
               }}
               onLoad={(map) => setMap(map)}
            >
               <Marker position={center} />
               {directionsResponse && (
                  <DirectionsRenderer directions={directionsResponse} />
               )}
            </GoogleMap>
         </Box>
      </Box>
   );
}

export default MapControl;