import { Form, Select } from 'antd';

/* eslint-disable react/prop-types */
export default function DependentSelect({ name, data, loading, deps, placeholder, labelKey = 'name', valueKey = 'id', ...props }) {
  return (
    <Form.Item name={name} {...props}>
      <Select size="large" placeholder={placeholder} disabled={!deps} loading={loading}>
        {data?.map((item) => (
          <Select.Option key={item[valueKey]} value={item[valueKey]}>
            {item[labelKey]}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
}
