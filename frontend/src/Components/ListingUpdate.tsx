import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";

// Contexts
import StateContext from "../Contexts/StateContext";
import { type ListingInfo } from "./ListingDetail";

// MUI
import {
	Grid,
	Typography,
	Button,
	TextField,
	FormControlLabel,
	Checkbox,
	Snackbar,
	Box,
	Container,
	Paper,
} from "@mui/material";

interface ListingUpdateProps {
    listingData: ListingInfo;
    closeDialog: () => void;
}


interface State {
    titleValue: string;
    listingTypeValue: string;
    descriptionValue: string;
    propertyStatusValue: string;
    priceValue: string | number;
    rentalFrequencyValue: string;
    roomsValue: string| number;
    furnishedValue: boolean;
    poolValue: boolean;
    elevatorValue: boolean;
    cctvValue: boolean;
    parkingValue: boolean;
    sendRequest: number;
    openSnack: boolean;
    disabledBtn: boolean;
}

type Action =
    | { type: "catchTitleChange"; titleChosen: string }
    | { type: "catchListingTypeChange"; listingTypeChosen: string }
    | { type: "catchDescriptionChange"; descriptionChosen: string }
    | { type: "catchPropertyStatusChange"; propertyStatusChosen: string }
    | { type: "catchPriceChange"; priceChosen: string }
    | { type: "catchRentalFrequencyChange"; rentalFrequencyChosen: string }
    | { type: "catchRoomsChange"; roomsChosen: string| number }
    | { type: "catchFurnishedChange"; furnishedChosen: boolean }
    | { type: "catchPoolChange"; poolChosen: boolean }
    | { type: "catchElevatorChange"; elevatorChosen: boolean }
    | { type: "catchCctvChange"; cctvChosen: boolean }
    | { type: "catchParkingChange"; parkingChosen: boolean }
    | { type: "changeSendRequest" }
    | { type: "openTheSnack" }
    | { type: "closeTheSnack" }
    | { type: "disableTheButton" }
    | { type: "allowTheButton" };


const listingTypeOptions = [
	{
		value: "",
		label: "",
	},
	{
		value: "Apartment",
		label: "Apartment",
	},
	{
		value: "House",
		label: "House",
	},
	{
		value: "Office",
		label: "Office",
	},
];

const propertyStatusOptions = [
	{
		value: "",
		label: "",
	},
	{
		value: "Sale",
		label: "Sale",
	},
	{
		value: "Rent",
		label: "Rent",
	},
];

const rentalFrequencyOptions = [
	{
		value: "",
		label: "",
	},
	{
		value: "Month",
		label: "Month",
	},
	{
		value: "Week",
		label: "Week",
	},
	{
		value: "Day",
		label: "Day",
	},
];

type GlobalStateType = {
  userId: string;
};

function ListingUpdate(props: ListingUpdateProps) {
	const navigate = useNavigate();
	const GlobalState = useContext(StateContext) as GlobalStateType;

	const initialState = {
		titleValue: props.listingData.title,
		listingTypeValue: props.listingData.listing_type,
		descriptionValue: props.listingData.description,
		propertyStatusValue: props.listingData.property_status,
		priceValue: props.listingData.price,
		rentalFrequencyValue: props.listingData.rental_frequency || "",
		roomsValue: props.listingData.rooms,
		furnishedValue: props.listingData.furnished,
		poolValue: props.listingData.pool,
		elevatorValue: props.listingData.elevator,
		cctvValue: props.listingData.cctv,
		parkingValue: props.listingData.parking,
		sendRequest: 0,
		openSnack: false,
		disabledBtn: false,
	};

	function ReducerFuction(draft: State, action: Action) {
		switch (action.type) {
			case "catchTitleChange":
				draft.titleValue = action.titleChosen;
				break;

			case "catchListingTypeChange":
				draft.listingTypeValue = action.listingTypeChosen;
				break;

			case "catchDescriptionChange":
				draft.descriptionValue = action.descriptionChosen;
				break;

			case "catchPropertyStatusChange":
				draft.propertyStatusValue = action.propertyStatusChosen;
				break;

			case "catchPriceChange":
				draft.priceValue = action.priceChosen;
				break;

			case "catchRentalFrequencyChange":
				draft.rentalFrequencyValue = action.rentalFrequencyChosen;
				break;

			case "catchRoomsChange":
				draft.roomsValue = action.roomsChosen;
				break;

			case "catchFurnishedChange":
				draft.furnishedValue = action.furnishedChosen;
				break;

			case "catchPoolChange":
				draft.poolValue = action.poolChosen;
				break;

			case "catchElevatorChange":
				draft.elevatorValue = action.elevatorChosen;
				break;

			case "catchCctvChange":
				draft.cctvValue = action.cctvChosen;
				break;

			case "catchParkingChange":
				draft.parkingValue = action.parkingChosen;
				break;

			case "changeSendRequest":
				draft.sendRequest = draft.sendRequest + 1;
				break;

			case "openTheSnack":
				draft.openSnack = true;
				break;

			case "closeTheSnack":
				draft.openSnack = false;
				break;

			case "disableTheButton":
				draft.disabledBtn = true;
				break;

			case "allowTheButton":
				draft.disabledBtn = false;
				break;
		}
	}

	const [state, dispatch] = useImmerReducer(ReducerFuction, initialState);

	function FormSubmit(e: React.FormEvent) {
		e.preventDefault();

		dispatch({ type: "changeSendRequest" });
		dispatch({ type: "disableTheButton" });
	}

	useEffect(() => {
		if (state.sendRequest) {
			async function UpdateProperty() {
				const formData = new FormData();
				if (state.listingTypeValue === "Office") {
					formData.append("title", state.titleValue);
					formData.append("description", state.descriptionValue);
					formData.append("listing_type", state.listingTypeValue);
					formData.append("property_status", state.propertyStatusValue);
					formData.append("price", String(state.priceValue));
					formData.append("rental_frequency", state.rentalFrequencyValue);
					formData.append("rooms", "0");
					formData.append("furnished", String(state.furnishedValue));
					formData.append("pool", String(state.poolValue));
					formData.append("elevator", String(state.elevatorValue));
					formData.append("cctv", String(state.cctvValue));
					formData.append("parking", String(state.parkingValue));
					formData.append("seller", GlobalState.userId);
				} else {
					formData.append("title", state.titleValue);
					formData.append("description", state.descriptionValue);
					formData.append("listing_type", state.listingTypeValue);
					formData.append("property_status", state.propertyStatusValue);
					formData.append("price", String(state.priceValue));
					formData.append("rental_frequency", state.rentalFrequencyValue);
					formData.append("rooms", String(state.roomsValue));
					formData.append("furnished", String(state.furnishedValue));
					formData.append("pool", String(state.poolValue));
					formData.append("elevator", String(state.elevatorValue));
					formData.append("cctv", String(state.cctvValue));
					formData.append("parking", String(state.parkingValue));
					formData.append("seller", GlobalState.userId);
				}

				try {
					await Axios.patch(
						`http://127.0.0.1:8000/api/listings/${props.listingData.id}/update/`,
						formData
					);

					dispatch({ type: "openTheSnack" });
				} catch (e) {
					dispatch({ type: "allowTheButton" });
				}
			}
			UpdateProperty();
		}
	}, [state.sendRequest]);

	useEffect(() => {
		if (state.openSnack) {
			setTimeout(() => {
				navigate(0);
			}, 1500);
		}
	}, [state.openSnack]);

	function PriceDisplay() {
		if (
			state.propertyStatusValue === "Rent" &&
			state.rentalFrequencyValue === "Day"
		) {
			return "Price per Day*";
		} else if (
			state.propertyStatusValue === "Rent" &&
			state.rentalFrequencyValue === "Week"
		) {
			return "Price per Week*";
		} else if (
			state.propertyStatusValue === "Rent" &&
			state.rentalFrequencyValue === "Month"
		) {
			return "Price per Month*";
		} else {
			return "Price*";
		}
	}

	return (
		<Box
			sx={{
				backgroundColor: "#252932",
				py: 4,
			}}
		>
			<Container maxWidth="md">
				<Paper
					elevation={8}
					sx={{
						p: 4,
						borderRadius: "16px",
						background: "rgba(255, 255, 255, 0.05)",
						backdropFilter: "blur(10px)",
						border: "1px solid rgba(235, 175, 112, 0.2)",
					}}
				>
					<form onSubmit={FormSubmit}>
						<Typography
							variant="h4"
							sx={{
								color: "#EBAF70",
								fontWeight: "bold",
								textAlign: "center",
								mb: 3,
							}}
						>
							Update Listing
						</Typography>

						<Grid container sx={{ mb: 2 }}>
							<TextField
								id="title"
								label="Title*"
								variant="outlined"
								fullWidth
								value={state.titleValue}
								onChange={(e) =>
									dispatch({
										type: "catchTitleChange",
										titleChosen: e.target.value,
									})
								}
								sx={{
									"& .MuiOutlinedInput-root": {
										color: "white",
										"& fieldset": {
											borderColor: "rgba(255, 255, 255, 0.3)",
										},
										"&:hover fieldset": {
											borderColor: "#EBAF70",
										},
										"&.Mui-focused fieldset": {
											borderColor: "#EBAF70",
										},
									},
									"& .MuiInputLabel-root": {
										color: "rgba(255, 255, 255, 0.7)",
									},
									"& .MuiInputLabel-root.Mui-focused": {
										color: "#EBAF70",
									},
								}}
							/>
						</Grid>

						<Grid container spacing={2} sx={{ mb: 2 }}>
							<Grid size={6}>
								<TextField
									id="listingType"
									label="Listing Type*"
									variant="outlined"
									fullWidth
									value={state.listingTypeValue}
									onChange={(e) =>
										dispatch({
											type: "catchListingTypeChange",
											listingTypeChosen: e.target.value,
										})
									}
									select
									slotProps={{
										select: {
											native: true,
										},
									}}
									sx={{
										"& .MuiOutlinedInput-root": {
											color: "white",
											"& fieldset": {
												borderColor: "rgba(255, 255, 255, 0.3)",
											},
											"&:hover fieldset": {
												borderColor: "#EBAF70",
											},
											"&.Mui-focused fieldset": {
												borderColor: "#EBAF70",
											},
										},
										"& .MuiInputLabel-root": {
											color: "rgba(255, 255, 255, 0.7)",
										},
										"& .MuiInputLabel-root.Mui-focused": {
											color: "#EBAF70",
										},
									}}
								>
									{listingTypeOptions.map((option) => (
										<option key={option.value} value={option.value} style={{ backgroundColor: "#252932" }}>
											{option.label}
										</option>
									))}
								</TextField>
							</Grid>

							<Grid size={6}>
								<TextField
									id="propertyStatus"
									label="Property Status*"
									variant="outlined"
									fullWidth
									value={state.propertyStatusValue}
									onChange={(e) =>
										dispatch({
											type: "catchPropertyStatusChange",
											propertyStatusChosen: e.target.value,
										})
									}
									select
									slotProps={{
										select: {
											native: true,
										},
									}}
									sx={{
										"& .MuiOutlinedInput-root": {
											color: "white",
											"& fieldset": {
												borderColor: "rgba(255, 255, 255, 0.3)",
											},
											"&:hover fieldset": {
												borderColor: "#EBAF70",
											},
											"&.Mui-focused fieldset": {
												borderColor: "#EBAF70",
											},
										},
										"& .MuiInputLabel-root": {
											color: "rgba(255, 255, 255, 0.7)",
										},
										"& .MuiInputLabel-root.Mui-focused": {
											color: "#EBAF70",
										},
									}}
								>
									{propertyStatusOptions.map((option) => (
										<option key={option.value} value={option.value} style={{ backgroundColor: "#252932" }}>
											{option.label}
										</option>
									))}
								</TextField>
							</Grid>
						</Grid>

						<Grid container spacing={2} sx={{ mb: 2 }}>
							<Grid size={6}>
								<TextField
									id="rentalFrequency"
									label="Rental Frequency"
									variant="outlined"
									disabled={state.propertyStatusValue === "Sale"}
									fullWidth
									value={state.rentalFrequencyValue}
									onChange={(e) =>
										dispatch({
											type: "catchRentalFrequencyChange",
											rentalFrequencyChosen: e.target.value,
										})
									}
									select
									slotProps={{
										select: {
											native: true,
										},
									}}
									sx={{
										"& .MuiOutlinedInput-root": {
											color: "white",
											"& fieldset": {
												borderColor: "rgba(255, 255, 255, 0.3)",
											},
											"&:hover fieldset": {
												borderColor: "#EBAF70",
											},
											"&.Mui-focused fieldset": {
												borderColor: "#EBAF70",
											},
										},
										"& .MuiInputLabel-root": {
											color: "rgba(255, 255, 255, 0.7)",
										},
										"& .MuiInputLabel-root.Mui-focused": {
											color: "#EBAF70",
										},
									}}
								>
									{rentalFrequencyOptions.map((option) => (
										<option key={option.value} value={option.value} style={{ backgroundColor: "#252932" }}>
											{option.label}
										</option>
									))}
								</TextField>
							</Grid>

							<Grid size={6}>
								<TextField
									id="price"
									type="number"
									label={PriceDisplay()}
									variant="outlined"
									fullWidth
									value={state.priceValue}
									onChange={(e) =>
										dispatch({
											type: "catchPriceChange",
											priceChosen: e.target.value,
										})
									}
									sx={{
										"& .MuiOutlinedInput-root": {
											color: "white",
											"& fieldset": {
												borderColor: "rgba(255, 255, 255, 0.3)",
											},
											"&:hover fieldset": {
												borderColor: "#EBAF70",
											},
											"&.Mui-focused fieldset": {
												borderColor: "#EBAF70",
											},
										},
										"& .MuiInputLabel-root": {
											color: "rgba(255, 255, 255, 0.7)",
										},
										"& .MuiInputLabel-root.Mui-focused": {
											color: "#EBAF70",
										},
									}}
								/>
							</Grid>
						</Grid>

						<Grid container sx={{ mb: 2 }}>
							<TextField
								id="description"
								label="Description"
								variant="outlined"
								multiline
								rows={6}
								fullWidth
								value={state.descriptionValue}
								onChange={(e) =>
									dispatch({
										type: "catchDescriptionChange",
										descriptionChosen: e.target.value,
									})
								}
								sx={{
									"& .MuiOutlinedInput-root": {
										color: "white",
										"& fieldset": {
											borderColor: "rgba(255, 255, 255, 0.3)",
										},
										"&:hover fieldset": {
											borderColor: "#EBAF70",
										},
										"&.Mui-focused fieldset": {
											borderColor: "#EBAF70",
										},
									},
									"& .MuiInputLabel-root": {
										color: "rgba(255, 255, 255, 0.7)",
									},
									"& .MuiInputLabel-root.Mui-focused": {
										color: "#EBAF70",
									},
								}}
							/>
						</Grid>

						{state.listingTypeValue === "Office" ? (
							""
						) : (
							<Grid size={4} sx={{ mb: 2 }}>
								<TextField
									id="rooms"
									label="Rooms"
									type="number"
									variant="outlined"
									fullWidth
									value={state.roomsValue}
									onChange={(e) =>
										dispatch({
											type: "catchRoomsChange",
											roomsChosen: e.target.value,
										})
									}
									sx={{
										"& .MuiOutlinedInput-root": {
											color: "white",
											"& fieldset": {
												borderColor: "rgba(255, 255, 255, 0.3)",
											},
											"&:hover fieldset": {
												borderColor: "#EBAF70",
											},
											"&.Mui-focused fieldset": {
												borderColor: "#EBAF70",
											},
										},
										"& .MuiInputLabel-root": {
											color: "rgba(255, 255, 255, 0.7)",
										},
										"& .MuiInputLabel-root.Mui-focused": {
											color: "#EBAF70",
										},
									}}
								/>
							</Grid>
						)}

						<Grid container spacing={2} sx={{ mb: 3 }}>
							<Grid size={4}>
								<FormControlLabel
									control={
										<Checkbox
											checked={state.furnishedValue}
											onChange={(e) =>
												dispatch({
													type: "catchFurnishedChange",
													furnishedChosen: e.target.checked,
												})
											}
											sx={{
												color: "#EBAF70",
												"&.Mui-checked": {
													color: "#EBAF70",
												},
											}}
										/>
									}
									label={
										<Typography sx={{ color: "white" }}>Furnished</Typography>
									}
								/>
							</Grid>

							<Grid size={4}>
								<FormControlLabel
									control={
										<Checkbox
											checked={state.poolValue}
											onChange={(e) =>
												dispatch({
													type: "catchPoolChange",
													poolChosen: e.target.checked,
												})
											}
											sx={{
												color: "#EBAF70",
												"&.Mui-checked": {
													color: "#EBAF70",
												},
											}}
										/>
									}
									label={<Typography sx={{ color: "white" }}>Pool</Typography>}
								/>
							</Grid>

							<Grid size={4}>
								<FormControlLabel
									control={
										<Checkbox
											checked={state.elevatorValue}
											onChange={(e) =>
												dispatch({
													type: "catchElevatorChange",
													elevatorChosen: e.target.checked,
												})
											}
											sx={{
												color: "#EBAF70",
												"&.Mui-checked": {
													color: "#EBAF70",
												},
											}}
										/>
									}
									label={
										<Typography sx={{ color: "white" }}>Elevator</Typography>
									}
								/>
							</Grid>

							<Grid size={4}>
								<FormControlLabel
									control={
										<Checkbox
											checked={state.cctvValue}
											onChange={(e) =>
												dispatch({
													type: "catchCctvChange",
													cctvChosen: e.target.checked,
												})
											}
											sx={{
												color: "#EBAF70",
												"&.Mui-checked": {
													color: "#EBAF70",
												},
											}}
										/>
									}
									label={<Typography sx={{ color: "white" }}>CCTV</Typography>}
								/>
							</Grid>

							<Grid size={4}>
								<FormControlLabel
									control={
										<Checkbox
											checked={state.parkingValue}
											onChange={(e) =>
												dispatch({
													type: "catchParkingChange",
													parkingChosen: e.target.checked,
												})
											}
											sx={{
												color: "#EBAF70",
												"&.Mui-checked": {
													color: "#EBAF70",
												},
											}}
										/>
									}
									label={<Typography sx={{ color: "white" }}>Parking</Typography>}
								/>
							</Grid>
						</Grid>

						<Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
							<Button
								variant="contained"
								type="submit"
								disabled={state.disabledBtn}
								sx={{
									backgroundColor: "#EBAF70",
									color: "#252932",
									fontWeight: "bold",
									px: 4,
									py: 1.5,
									"&:hover": {
										backgroundColor: "#d99f5f",
									},
									"&:disabled": {
										backgroundColor: "rgba(235, 175, 112, 0.5)",
									},
								}}
							>
								Update
							</Button>
							<Button
								variant="outlined"
								onClick={props.closeDialog}
								sx={{
									borderColor: "#EBAF70",
									color: "#EBAF70",
									px: 4,
									py: 1.5,
									"&:hover": {
										borderColor: "#d99f5f",
										color: "#d99f5f",
										backgroundColor: "rgba(235, 175, 112, 0.1)",
									},
								}}
							>
								Cancel
							</Button>
						</Box>
					</form>
					<Snackbar
						open={state.openSnack}
						message="You have successfully updated this listing!"
						anchorOrigin={{
							vertical: "bottom",
							horizontal: "center",
						}}
						autoHideDuration={3000}
						onClose={() => dispatch({ type: "closeTheSnack" })}
					/>
				</Paper>
			</Container>
		</Box>
	);
}

export default ListingUpdate;