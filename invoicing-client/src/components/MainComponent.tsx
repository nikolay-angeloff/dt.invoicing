import React, {useState} from "react";
import {CalculateResponse, DefaultApi} from "../generated-sources/openapi";
import {Button, Form, Input, Modal, notification, Table, Upload} from "antd";
import {MinusCircleOutlined, PlusOutlined, UploadOutlined} from '@ant-design/icons';

const MainComponent = () => {
    type NotificationType = 'success' | 'info' | 'warning' | 'error';

    const api = new DefaultApi(undefined, "http://localhost:8080/api/v1");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [response, setResponse] = useState<CalculateResponse>();

    const openNotificationWithIcon = (type: NotificationType, title: string, description: string) => {
        notification[type]({
            message: title,
            description: description,
            placement: 'top',
        });
    };

    const normFile = (e: any) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const columns = [
        {
            title: 'Customer Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Balance',
            dataIndex: 'balance',
            key: 'age',
        },
    ];

    const formItemLayout = {
        labelCol: {
            xs: {span: 8},
            sm: {span: 8},
        },
        wrapperCol: {
            xs: {span: 16},
            sm: {span: 16},
        },
    };
    const formItemLayoutWithOutLabel = {
        wrapperCol: {
            xs: {span: 24, offset: 8},
            sm: {span: 20, offset: 8},
        },
    };

    const onFinish = (values: any) => {

        api.sumInvoices(values.file[0]!.originFileObj, values.currencies, values.outputCurrency, values.customer!)
            .then((result) => {
                setResponse(result.data)
                showModal();
            }).catch((error) => {
            openNotificationWithIcon('error', 'Error', error.response.data)
        });

    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Form
                name="basic"
                labelCol={{span: 8}}
                wrapperCol={{span: 8}}
                initialValues={{remember: true}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >

                <Form.Item
                    name="file"
                    label="CSV File"
                    getValueFromEvent={normFile}
                >
                    <Upload name="csv" accept=".csv" beforeUpload={() => false} maxCount={1}>
                        <Button icon={<UploadOutlined/>}>Click to upload</Button>
                    </Upload>
                </Form.Item>

                <Form.List
                    name="currencies"
                    rules={[
                        {
                            validator: async (_, names) => {
                                if (!names || names.length < 1) {
                                    return Promise.reject(new Error('At least 1 currency'));
                                }
                            },
                        },
                    ]}
                >
                    {(fields, {add, remove}, {errors}) => (
                        <>
                            {fields.map((field, index) => (
                                <Form.Item
                                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                    label={index === 0 ? 'Currencies' : ''}
                                    required={false}
                                    key={field.key}
                                >
                                    <Form.Item
                                        {...field}
                                        validateTrigger={['onChange', 'onBlur']}
                                        rules={[
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: "Please input currency delete this field.",
                                            },
                                        ]}
                                        noStyle
                                    >
                                        <Input placeholder="currency" style={{width: '60%'}}/>
                                    </Form.Item>
                                    {fields.length > 1 ? (
                                        <MinusCircleOutlined
                                            className="dynamic-delete-button"
                                            onClick={() => remove(field.name)}
                                        />
                                    ) : null}
                                </Form.Item>
                            ))}
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    style={{width: '60%', marginLeft: '100%'}}
                                    icon={<PlusOutlined/>}
                                >
                                    Add currency
                                </Button>
                                <Form.ErrorList errors={errors}/>
                            </Form.Item>
                        </>
                    )}
                </Form.List>

                <Form.Item
                    label="Output Currency"
                    name="outputCurrency"
                    rules={[{required: true, message: 'Please input output currency!'}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Filter by Customer VAT"
                    name="customer"
                >
                    <Input/>
                </Form.Item>

                <Form.Item wrapperCol={{offset: 8, span: 16}}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
            <Modal title={response?.currency} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Table dataSource={response?.customers} columns={columns}/>
            </Modal>
        </>
    );
}

export default MainComponent;