import React from 'react';
import { Form, Input, Icon, Button, Card, Spin } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
// import NaviAdd from './NaviAdd';
import NaviCardForm from './NaviCard';
import { fetchApi } from '../../callApi'
import { getNaviInfo } from '../../constants/api/navi'

//当个容器吧

// let data = NaviData.data;
//在这里渲染已有数据，并且可以添加和修改
class NaviManage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
        }
    }
    handleAddItem = () => {
        let { data } = this.state;
        //存在一点问题。
        let lastData = data[data.length - 1];
        data.push({
            id: -1,
            title: null,
            rank: parseInt(lastData.rank) + 1,
            grade: 1,
            parents_id: 0,
            children: [
            ],
            confirm: false //自己写的数据有一个confirm
        })
        this.setState({
            data: data,
        })
    }
    handleUpdateID = (id, index) => {
        const { data } = this.state;
        data[index].id = id;
        this.setState({
            data: data
        })
    }

    render() {
        let data = this.state.data;
        console.log(data);
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 12, offset: 6 },
                sm: { span: 12, offset: 6 },
            },
        };
        return (
            //根据接口获取以后的
            <div>
                <BreadcrumbCustom first="导航栏管理" />
                {/* {console.log(data)}  */}
                {data && data.length > 0 ? data.map((x, i) => {
                    return <NaviCardForm data={x} length={data.length}
                        update={this.handleUpdateID}
                        delete={this.handleDeleteItem} key={i} index={i} />
                }) : <Spin size="large" />}
                <Card style={{ marginTop: "50px" }}>
                    {/* 在添加的时候直接修改state，增加一个状态。那个数据直接从fetch中拿取。 */}
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Item {...formItemLayoutWithOutLabel}>
                            <Button type="dashed" onClick={this.handleAddItem}
                                style={{ width: "100%" }}
                            ><Icon type="plus" />添加导航</Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        );
    }
    componentDidMount() {
        const { apiPath, request } = getNaviInfo();
        fetchApi(apiPath, request)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    data: data.data,
                })
            });
    }
}

export default NaviManage;