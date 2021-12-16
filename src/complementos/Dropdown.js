import React from 'react';


//const Select1 = styled.select1`
    //color: white`; 

const Dropdown = props => {

    const dropdownChanged = e => {
        props.changed(e.target.value);

    }

    return (
        <div className="col-sm-6 form-group row px-6">
            <label className="form-label col-sm-1">{props.label}</label>
            <select value={props.selectedValue} onChange={dropdownChanged} className="form-control form-control-sm col-sm-1">
                <option key={0}>Select...</option>
                {props.options.map((item, idx) => <option key={idx + 1} value={item.id}>{item.name}</option>)}  
            </select>
        </div>
    );
}

export default Dropdown;