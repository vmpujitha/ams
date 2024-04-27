import React from 'react';
// import SingleFleetItem from './SingleFleetItem';

const FleetList = (props) => {

    if(!props.fleet.length){
        return(
            <div style={{textAlign: 'center'}}>Successfully Found</div>
        )
    }

    // return (
    //     <ul className='list-autos'>
    //        <SingleFleetItem model="car" carType="nano" seats="4" gears="6" Price= {2000} />
    //        <SingleFleetItem model="car" carType="HondaFit" seats="5" gears="6" Price= {2000}/>
    //        <SingleFleetItem model="car" carType="Kiario" seats="5" gears="6" Price= {2000}/>
    //        <SingleFleetItem model="car" carType="Hyundai" seats="7" gears="6" Price= {2000}/>
    //        <SingleFleetItem model="car" carType="Fiat" seats="6" gears="7" Price= {2000}/>    
    //        <SingleFleetItem model="car" carType="Tesla" seats="4" gears="1" Price= {2000}/>     
    //     </ul>
    // )
}

export default FleetList;