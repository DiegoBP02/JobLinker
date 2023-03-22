interface FormRowProps {
  type: string;
  name: string;
  value: string | number;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
  noLabel?: boolean;
  labelText?: string;
}

const FormRow: React.FC<FormRowProps> = ({
  type,
  name,
  value,
  handleChange,
  labelText,
  noLabel,
}) => {
  return (
    <div className="form-row">
      {!noLabel && (
        <label htmlFor={name} className="form-label">
          {labelText || name}
        </label>
      )}
      <input
        type={type}
        value={value}
        name={name}
        onChange={handleChange}
        className="form-input"
      />
    </div>
  );
};

export default FormRow;
