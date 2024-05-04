import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Import your database and router if needed, though not utilized directly in this snippet
import * as db from '../../database';
import { useRouter } from 'next/router';

const PickTime = ({ onChangeDate }) => {
    const [startDate, setStartDate] = useState(new Date());

    return (
        <DatePicker
            showIcon
            selected={startDate}
            onChange={(date) => {
                setStartDate(date);
                onChangeDate(date);  // Callback to pass date up if needed
            }}
            showTimeSelect
            dateFormat="Pp"
            className="date-picker-dropdown"
        >
            <div style={{ color: "red" }}>Don't forget to check the weather!</div>
        </DatePicker>
    );
};

const Dropdown = ({ options, value, onChange }) => {
    // This state could be used to handle date selections if needed at this level
    const [selectedDates, setSelectedDates] = useState({});

    const handleDateChange = (value, date) => {
        setSelectedDates(prev => ({ ...prev, [value]: date }));
    };

    const handlePropose = (value) => {
        if (selectedDates[value]) {
            // Implement your propose logic here
            console.log(`Proposing ${value} for date ${selectedDates[value]}`);
        } else {
            alert("Please select a date first!");
        }
    };

    return (
        <div className="dropdown is-active">
            <div className="dropdown-trigger">
                <button className="button"
                    aria-haspopup="true"
                    aria-controls="dropdown-menu">
                    <span>Select a place, select the date and time, then click purpose!</span>
                    <span className="icon is-small">
                        <i className="fas fa-angle-down" aria-hidden="true"></i>
                    </span>
                </button>
            </div>
            <div className="dropdown-menu" id="dropdown-menu" role="menu">
                <div className="dropdown-content">
                    {options.map((option, index) => (
                        <>
                            <div key={option.value}
                                className="dropdown-item"
                                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>

                                <a href="#"
                                    className={`button is-fullwidth ${value === option.value ? 'is-active' : ''}`}
                                    style={{ marginLeft: '20px', marginRight: '20px', whiteSpace: 'normal', overflowWrap: 'break-word' }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onChange(option.value);
                                    }}>
                                    {option.label}
                                </a>
                                <PickTime onChangeDate={(date) => handleDateChange(option.value, date)} />
                                <button
                                    className="button is-small is-info"
                                    style={{ marginLeft: '20px', marginRight: '20px' }}
                                    onClick={() => handlePropose(option.value)}>
                                    Propose
                                </button>
                            </div>
                            {index < options.length - 1 && <hr className="dropdown-divider" />}
                        </>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dropdown;
