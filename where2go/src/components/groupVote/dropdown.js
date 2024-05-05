import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const PickTime = ({ onChangeDate }) => {
    const [startDate, setStartDate] = useState(null);

    return (
        <DatePicker
            showIcon
            placeholderText="Click to select a date"
            selected={startDate}
            onChange={(date) => {
                setStartDate(date);
                onChangeDate(date);
            }}
            showTimeSelect
            dateFormat="Pp"
            className="date-picker-dropdown"
        >
            <div style={{ color: "red" }}>Don't forget to check the weather!</div>
        </DatePicker>
    );
};

const DropdownItem = ({ option, onPropose }) => {
    const [selectedDate, setSelectedDate] = useState(null);

    const handleSubmit = () => {
        if (!selectedDate) {
            alert("Please select a date before proposing.");
            return;
        }

        console.log("Submitting for proposal", { place: option, selectedDate });
        onPropose({
            place: option,
            date: selectedDate,
        });
    };

    return (
        <div className="dropdown-item"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span className={`button is-fullwidth ${option.isSelected ? 'is-active' : ''}`}
                style={{ marginLeft: '20px', marginRight: '20px', whiteSpace: 'normal', overflowWrap: 'break-word' }}
                onClick={(e) => {
                    e.preventDefault();
                    option.isSelected = true;
                }}>
                {option.label}
            </span>
            <PickTime onChangeDate={setSelectedDate} />
            <button
                className="button is-small is-info"
                style={{ marginLeft: '20px', marginRight: '20px' }}
                onClick={handleSubmit}>
                Propose
            </button>
        </div>
    );
};

const Dropdown = ({ options, onPropose }) => {
    return (
        <div className="dropdown is-active">
            <div className="dropdown-trigger">
                <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                    <span>Select a place, select the date and time, then click propose!</span>
                    <span className="icon is-small">
                        <i className="fas fa-angle-down" aria-hidden="true"></i>
                    </span>
                </button>
            </div>
            <div className="dropdown-menu" id="dropdown-menu" role="menu">
                <div className="dropdown-content">
                    {options.map((option, index) => (
                        <React.Fragment key={option.value}>
                            <DropdownItem option={option} onPropose={onPropose} />
                            {index < options.length - 1 && <hr className="dropdown-divider" />}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dropdown;
