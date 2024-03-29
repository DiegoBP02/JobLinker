interface FormRowSelectProps {
  name: string;
  value: string | number;
  handleChange: React.ChangeEventHandler<HTMLSelectElement>;
  labelText?: string;
  list: string[] | number[];
}

const FormRowSelect: React.FC<FormRowSelectProps> = ({
  name,
  value,
  handleChange,
  labelText,
  list,
}) => {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>

      <select
        name={name}
        value={value}
        onChange={handleChange}
        className="form-select"
      >
        {list.map((itemValue, index) => {
          return (
            <option value={itemValue} key={index}>
              {itemValue}
            </option>
          );
        })}
      </select>
    </div>
  );
};
export default FormRowSelect;
