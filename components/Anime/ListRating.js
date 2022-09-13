import { FormControl, Typography, Rating, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';



const StyledRating = styled(Rating)(({ theme }) => ({
    '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
        color: theme.palette.action.disabled,
    },
}));



function IconContainer(props) {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
}

IconContainer.propTypes = {
    value: PropTypes.number.isRequired,
};

const customIcons = {
    1: {
        icon: <SentimentDissatisfiedIcon color="error" />,
        label: 'Dissatisfied',
    },
    2: {
        icon: <SentimentSatisfiedIcon color="warning" />,
        label: 'Neutral',
    },
    3: {
        icon: <SentimentSatisfiedAltIcon color="success" />,
        label: 'Satisfied',
    },
};

const SwitchRating = ({ score, setScore }) => {
    const user = useSelector(state => state.user.value);


    switch (user.userScoreFormat) {
        case "POINT_100":
            return (
                <TextField
                    label="Rating"
                    id="mediaScore"
                    type="number"
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    onInput={(e) => {
                        e.target.value = Math.min(Math.max(0, e.target.value), 100)
                    }}
                    value={score}
                    onChange={(e) => { setScore(e.target.value) }}
                />
            )
        case "POINT_10_DECIMAL":
            return (
                <TextField
                    label="Rating"
                    id="mediaScore"
                    type="number"
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    onInput={(e) => {
                        e.target.value = Math.min(Math.max(0, e.target.value), 10)
                    }}
                    value={score}
                    onChange={(e) => { setScore(e.target.value) }}
                />
            )
        case "POINT_10":
            return (
                <div className="flex flex-col items-center">
                    <Typography component="legend">Score</Typography>
                    <Rating
                        sx={{ width: "min-content" }}
                        name="mediaRating"
                        value={score / 2}
                        precision={0.5}
                        defaultValue={0}
                        onChange={(event, newValue) => {
                            setScore(newValue * 2);
                        }}
                    />
                </div>
            )
        case "POINT_5":
            return (
                <div className="flex flex-col items-center">
                    <Typography component="legend">Score</Typography>
                    <Rating
                        sx={{ width: "min-content" }}
                        name="mediaRating"
                        value={score}
                        precision={1}
                        defaultValue={0}
                        onChange={(event, newValue) => {
                            setScore(newValue);
                        }}
                    />
                </div>
            )
        case "POINT_3":
            return (
                <div className="flex flex-col items-center">
                    <Typography component="legend">Score</Typography>
                    <StyledRating
                        name="mediaRating"
                        defaultValue={2}
                        value={score}
                        max={3}
                        onChange={(event, newValue) => {
                            setScore(newValue);
                        }}
                        IconContainerComponent={IconContainer}
                        highlightSelectedOnly
                    />
                </div>
            )

        default:
            break;
    }
}


const ListRating = ({ score, setScore }) => {
    return (
        <FormControl sx={{ width: "10rem" }}>
            <SwitchRating score={score} setScore={setScore} />
        </FormControl>
    )
}

export default ListRating