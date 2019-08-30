import React, { Component } from 'react';
import { Form, Select, Button, Icon, Col, Popconfirm, Input, Skeleton, message } from 'antd';
import { fetchApi } from '../../callApi';
import { getNaviInfo } from '../../constants/api/navi';
const { Option, OptGroup } = Select;
const confirmSaveText = '是否保存设置?';
const queue = ["ModelA", "ModelB", "ModelC", "ModelD"];
let id = 0;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
    },
};
const formItemLayoutWithOutLabel = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
    },
};


// 主要
class BindMan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isNaviLoaded: false,
            navData: null,
        }
    }

    componentDidMount = () => {
        // console.log(fetchApi(apiPath, request))
        if (!this.state.isNaviLoaded) {
            let { apiPath, request } = getNaviInfo();
            fetchApi(apiPath, request)
                .then(res => res.json())
                .then(data => {
                    // console.log(data.data)
                    this.setState({
                        navData: data.data,
                        isNaviLoaded: true,
                    })
                });
        }
    }

    noNaviNotification() {
        message.error("栏目列表获取失败");
    }

    listColumn(data) {
        let columns = [];
        // console.log(data[0].children[0].title);
        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                let opts = [];
                for (let j = 0; j < data[i].children.length; j++) {
                    opts.push(
                        <Option key={data[i].children[j].rank + '-' + data[i].children[j].id} value={data[i].children[j].id}>{data[i].children[j].title}</Option>
                    )
                }
                columns.push(
                    <OptGroup label={data[i].title}>{opts}</OptGroup>
                )
            }
        } else {
            return this.noNaviNotification();
        }
        return columns;
    }

    confirmSave = () => {

    }
    // handleSubmit = () => {
    //     let bindInfo = this.props.form.getFieldsValue();
    //     this.props.form.validateFields((err, values) => {
    //         if (!err) {
    //             message.success(`绑定至${bindInfo.bindItModelA}`)
    //         }
    //     })
    // }

    modelTitle = () => {
        if (this.props.isReady === true) {
            if (queue.indexOf(this.props.fromModel) > -1) {
                return this.props.bindInfo.title;
            } else {
                return this.props.bindInfo[0].nav_name;
            }
        } else {
            return null;
        }
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => (
            <Form.Item
                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                label={index === 0 ? 'Passengers' : ''}
                required={false}
                key={k}
            >
                {getFieldDecorator(`names[${k}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [
                        {
                            required: true,
                            whitespace: true,
                            message: "Please input passenger's name or delete this field.",
                        },
                    ],
                })(<Input placeholder="passenger name" style={{ width: '60%', marginRight: 8 }} />)}
                {keys.length > 1 ? (
                    <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        onClick={() => this.remove(k)}
                    />
                ) : null}
            </Form.Item>
        ));
        // console.log(this.props.isReady);
        return (
            <div>
                {this.state.isNaviLoaded ?
                    <Form {...formItemLayout} >
                        {this.props.fromModel !== "ModelF" ?
                            <Form.Item label="栏目选择">
                                {getFieldDecorator(`bindIt${this.props.fromModel}`, {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择一个栏目',
                                        },
                                    ],
                                    initialValue: this.modelTitle(),
                                })(
                                    <Select required="true" style={{ width: '30%' }} placeholder="请选择一个栏目">
                                        {/* <Option value="-1">请选择</Option> */}
                                        {this.state.isNaviLoaded ? this.listColumn(this.state.navData) : null}
                                    </Select>
                                )}
                            </Form.Item> : null
                        }
                        {
                            queue.indexOf(this.props.fromModel) > -1 ?
                                <Form.Item label="置顶文章" extra="如未选择，则默认为最新文章">
                                    {getFieldDecorator(`Top${this.props.fromModel}`, {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请选择一篇文章',
                                            },
                                        ],
                                    })(
                                        <Select style={{ width: '60%' }} placeholder="请选择一篇文章">
                                            {/* <Option value="-1">请选择</Option> */}
                                        </Select>
                                    )}
                                </Form.Item> : null
                        }
                        {
                            this.props.fromModel === "ModelE" ?
                                <div>
                                    <Form.Item label="栏目描述">
                                        {getFieldDecorator(`Description${this.props.fromModel}`, {
                                            rules: [
                                                {
                                                    max: 35,
                                                    message: '描述过长,请酌定删减',
                                                },
                                            ],
                                            initialValue: this.props.bindInfo[0].description,
                                        })(
                                            <Input style={{ width: '60%' }} placeholder="35字以内(选填)">
                                            </Input>
                                        )
                                        }
                                    </Form.Item>
                                    {/* {formItems}
                                    <Form.Item {...formItemLayoutWithOutLabel}>
                                        <Button type="dashed" onClick={this.add} style={{ width: '60%' }}><Icon type="plus" /> Add field</Button>
                                    </Form.Item>
                                    <Form.Item {...formItemLayoutWithOutLabel}>
                                        <Button type="primary" htmlType="submit">Submit</Button>
                                    </Form.Item> */}

                                </div>
                                : null
                        }
                        <Form.Item>
                            {/* <Button onClick={this.handleSubmit}>保存修改</Button> */}
                            <Col span={24} style={{ textAlign: 'right' }}>
                                {/* <Popconfirm placement="top" title={confirmClearText} onConfirm={this.confirmClear()} okText="确定" cancelText="取消">
                        <Button type="danger"><Icon type="undo" />清除</Button>
                    </Popconfirm> */}
                                <Popconfirm placement="top" title={confirmSaveText} onConfirm={this.confirmSave()} okText="确定" cancelText="取消">
                                    <Button ><Icon type="save" />保存修改</Button>
                                </Popconfirm>
                            </Col>
                        </Form.Item>
                    </Form > : <Skeleton active />
                }
            </div>
        )
    }
}


const BindList = Form.create('Bind')(BindMan);

export default BindList;