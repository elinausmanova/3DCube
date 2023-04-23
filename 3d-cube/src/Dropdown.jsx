import { Select } from 'antd';

function Dropdown({ defaultValue, options, updateValue, placeholder }) {

    const handleChange = (value) => {
        // console.log(`selected ${value}`);
        updateValue(value)
      };
      
    return (
        <Select
            defaultValue={defaultValue}
            placeholder={placeholder}
            style={{ width: 200 }}
            onChange={handleChange}
            options={options}
        />
    )
}

export default Dropdown;