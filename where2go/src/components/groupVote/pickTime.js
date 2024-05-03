// import React, { useState } from 'react';
// import * as db from '../../database';
// import { useRouter } from 'next/router';


// const PickaTime = ({ }) => {

//     return (
//         <div>

//         </div>
//     )
// };

// export default PickaTime;


import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function pickTime() {
    const [startDate, setStartDate] = useState(new Date());

    return (
        <DatePicker
            selected={startDate}
            onChange={date => setStartDate(date)}
            showTimeSelect
            dateFormat="Pp"
        />
    );
}

export default pickTime;
