import React, { useState } from 'react';
import * as db from '../../database';
import { useRouter } from 'next/router';


const Dropdown = ({ options, value, onChange }) => {
    return (
        <div className="dropdown is-active">
            <div className="dropdown-trigger">
                <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                    <span>Select a place below</span>
                    <span className="icon is-small">
                        <i className="fas fa-angle-down" aria-hidden="true"></i>
                    </span>
                </button>
            </div>
            <div className="dropdown-menu" id="dropdown-menu" role="menu">
                <div className="dropdown-content">
                    {options.map((option) => (
                        <a href="#" className={`dropdown-item ${value === option.value ? 'is-active' : ''}`}
                            key={option.value}
                            onClick={(e) => {
                                e.preventDefault();
                                onChange(option.value);
                            }}>
                            {option.label}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dropdown;
