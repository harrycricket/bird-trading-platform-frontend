import clsx from "clsx";
import s from "./sideBarFIlter.module.scss";
import React, { useEffect, useRef, useState } from "react";
import Filter from "../../asset/icons/Filter";
import {
  Box,
  Button,
  Checkbox,
  Fade,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Popover,
  Popper,
  Rating,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Style from "./../../style/inline-style/style";
import Popup from "reactjs-popup";
import OutlineInputCustom from "../input/outlinedInput/OutlineInputCustom";
import ButtonControl from "./ButtonControl";
import UpStar from "../../asset/icons/UpStar";
import { api } from "../../api/server/API";
import { useDispatch, useSelector } from "react-redux";
import productsPresentationSlices, {
  categorySelector,
  filterObjectSelector,
  getTypeOfProduct,
  productTypeSelector,
} from "../products-presentation/productsPresentationSlice";

const ratingCustomizer = {
  fontSize: "3.2rem",
  color: Style.color.$Dominant6,
};

const typeOfSort = ["Increase", "Decrease"];

const MenuProps = {
  disableScrollLock: true,
  PaperProps: {
    style: {
      maxHeight: "20rem",
      width: 250,
      color: Style.color.$Dominant1,
      fontSize: "2rem",
    },
  },
};

const textFieldStyle = {
  input: {
    fontSize: "2rem",
  },
  label: {
    fontSize: "2rem",
  },
};
const selectStyle = {
  fontSize: "2rem",
};
const ratingValue = [5, 4, 3, 2, 1];

export default function SideBarFilter() {
  const dispatch = useDispatch();

  const getProductType = useSelector(productTypeSelector);

  const getCategory = useSelector(categorySelector);

  const filterObj = useSelector(filterObjectSelector);

  const ref = useRef();

  const [listSlected, setListSlected] = React.useState([]);

  const [openPopup, setOpenPopup] = useState(false);

  const [typeTextValue, setTypeTextValue] = useState("...");

  useEffect(() => {
    if (listSlected.length > 0) {
      const textValue = listSlected.map((a) => a.name).join(", ");
      setTypeTextValue(textValue);
    } else {
      setTypeTextValue("...");
    }
  }, [listSlected]);

  useEffect(() => {
    dispatch(getTypeOfProduct());
    setListSlected([]);
  }, [getCategory]);

  const handleSelectTypeChange = (event) => {
    const {
      target: { value },
    } = event;
    setListSlected(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    const exist = filterObj.ListTypeId;
    const listId = value.map((a) => a.id);
    console.log(value);
    dispatch(
      productsPresentationSlices.actions.addToSelectedList({
        key: "",
        valueTemp: listId,
      })
    );
    console.log(value);
  };

  const handleSeletetedStar = (star) => {
    console.log(star);
    dispatch(
      productsPresentationSlices.actions.setStar({ key: "", star: star })
    );
  };


  const handleSortDirectChange = (event) => {
    const {
      target: { value },
    } = event;
    console.log(value);
    dispatch(
      productsPresentationSlices.actions.setSortDirection({
        key: "",
        direction: value,
      })
    );
  };


  console.log(filterObj);

  return (
    <div className={clsx(s.container)}>
      <div
        className={clsx(s.title)}
        onClick={() => {
          setOpenPopup((openPopup) => !openPopup);
        }}
      ></div>
      <div className={s.filterControl} ref={ref}>
        <div className={s.filterComponent}>
          <span className={s.title}>Type</span>
          <div className={s.filter}>
            <Tooltip
              title={
                <Typography fontSize={15} color={Style.color.$Accent1}>
                  {typeTextValue}
                </Typography>
              }
              TransitionComponent={Fade}
              placement="right-end"
            >
              <FormControl color="Accent7" fullWidth>
                <InputLabel
                  id="demo-multiple-checkbox-label"
                  sx={{ fontSize: "2rem" }}
                >
                  Categories
                </InputLabel>
                <Select
                  multiple
                  value={listSlected}
                  onChange={handleSelectTypeChange}
                  input={<OutlinedInput label="Categories" />}
                  renderValue={(selected) => {
                    return typeTextValue;
                  }}
                  MenuProps={MenuProps}
                  fullWidth={true}
                  sx={selectStyle}
                >
                  {getProductType.map((item) => (
                    <MenuItem key={item.id} value={item}>
                      <Checkbox
                        checked={listSlected.indexOf(item) > -1}
                        color="Dominant5"
                      />
                      <span style={{ fontSize: "2rem" }}>{item.name}</span>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Tooltip>
            <ButtonControl setListSlected={setListSlected} isType={true} />
          </div>
        </div>
        <div className={s.filterComponent}>
          <span className={s.title}>Rating</span>
          <div className={s.filter}>
            {ratingValue.map((value) => (
              <div
                onClick={() => handleSeletetedStar(value)}
                className={s.filterRating}
                key={value}
              >
                <Rating value={value} readOnly={true} sx={ratingCustomizer} />{" "}
                {value === 5 ? (
                  ""
                ) : (
                  <>
                    {" "}
                    <UpStar />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className={s.filterComponent}>
          <span className={s.title}>Price</span>
          <div className={clsx(s.filter)}>
            <FormControl color="Accent7" fullWidth>
              <InputLabel
                id="demo-multiple-checkbox-label"
                sx={{ fontSize: "2rem" }}
              >
                Sort price
              </InputLabel>
              <Select
                value={filterObj.sortPrice}
                onChange={handleSortDirectChange}
                input={<OutlinedInput label="Categories" />}
                renderValue={(selected) => {
                  return filterObj.sortPrice;
                }}
                MenuProps={MenuProps}
                fullWidth={true}
                sx={selectStyle}
              >
                {typeOfSort.map((name) => (
                  <MenuItem key={name} value={name}>
                    <span style={{ fontSize: "2rem" }}>{name}</span>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <OutlineInputCustom
              fs={"2rem"}
              line={"1.6rem"}
              color="Accent7"
              label="From price"
              lower={true}
            />
            <OutlineInputCustom
              fs={"2rem"}
              line={"1.6rem"}
              color="Accent7"
              label="To price"
              lower={false}
            />
            <ButtonControl />
          </div>
        </div>
      </div>
    </div>
  );
}
