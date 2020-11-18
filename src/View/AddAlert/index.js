import React from 'react';
import { Button, message } from 'antd';
import './index.css';
import 'rodal/lib/rodal.css';
import Rodal from 'rodal';
import videoBg from '../../assets/image/video.mp4';
import { LoadingOutlined } from '@ant-design/icons';

class AnimationCircle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            visibleFirst: false,
            visibleSecond: false,
            visibleThird: false,
            listItem:[],
            currentIndex:0,
            arrayTypeData:[
                {
                    name:"Type_Message",
                    value:1
                },
                {
                    name:"Type_Choice",
                    value:2
                },
                {
                    name:"Type_Input",
                    value:3
                }
            ]
        };
    }
    componentDidMount() {
        this.getListData()
        // setTimeout(this.showFirst, 10000);
    }

    getListData() {
        fetch('http://localhost:3000/data',{
            method: 'GET',
        }).then(res=>{
            return res.json()
        }).then(res=>{

            if(res.items.length)
            {
                this.setState({listItem: res.items})
                this.setData(res.items, this.state.currentIndex)
            }
            else
            {
                message.error('Error from server')
            }
           
        }).catch(err=>{
            console.log(err)
            message.error(err.message || 'Error from server')
        })
    }

    setData(array, index){

        for(let i=index; i < array.length; i++)
        {
            if(array[i].data.length)
            {
                let dataValue = array[i].data.find(item => item.dataKey === "Data")
                let voiceValue = array[i].data.find(item => item.dataKey === "Voice")
                let orderValue = array[i].data.find(item => item.dataKey === "Order")

                if(dataValue || voiceValue || orderValue)
                {
                    let typeData
                    this.state.arrayTypeData.forEach(type =>{
                        if(dataValue.dataVal[type.name])
                        {
                            typeData = type
                        }
                    })
                    this.setState({currentItem: array[i], currentIndex:index, 
                        dataValue : dataValue.dataVal[typeData.name], voiceValue : voiceValue.dataVal
                        ,orderValue: orderValue.dataVal, typeData, visible:true})
                    break;
                }
            }
        }
        console.log(this.state.typeData)
        console.log(this.state.dataValue)
        console.log(this.state.voiceValue)
        console.log(this.state.orderValue)
    }

    closeModal(){
        this.setState({visible:false})
    }

    // showFirst = () => {
    //     this.setState({ visibleFirst: true });
    // }
    // showSecond = () => {
    //     setTimeout((
    //         this.setState({
    //             visibleFirst: false,
    //             visibleSecond: true
    //         })
    //     ), 5000);
    // }
    // showThird = () => {
    //     setTimeout((
    //         this.setState({
    //             visibleSecond: false,
    //             visibleThird: true
    //         })
    //     ), 5000);
    // }

    // hideThird = () => {
    //     this.setState({ visibleThird: false });
    // }

    render() {

        const { visible, currentItem, dataValue, voiceValue, orderValue } = this.state
        console.log(currentItem)
        if(dataValue)
        {
            console.log(dataValue)
            console.log(Array.isArray(dataValue.title))
        }
        return (
            <div className='container'>
                <video autoPlay="autoplay" loop="loop" muted className='video' >
                    <source src={videoBg} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="div-loading">
                    <LoadingOutlined className="loading-icon" />
                </div>
                
                {currentItem ? (
                    <Rodal
                    height={200}
                    width={400}
                    visible={visible}
                    showCloseButton={false}
                    animation='slideUp'
                    duration ='1500'
                    >

                    {Array.isArray(dataValue.title) ? (
                        <p className="content-modal">{dataValue.title[0]}</p>
                    ) :(
                        <p className="content-modal">{dataValue.title}</p>
                    )}
                    <div className="div-button">
                        <Button className="mr15 left-btn" onClick={() => this.closeModal()}>English</Button>
                        <Button className="right-btn" onClick={() => this.closeModal()}>Francais</Button>
                    </div>
                    </Rodal>
                ): ''}

                {/* <Rodal
                    height={200}
                    width={400}
                    visible={this.state.visibleFirst}
                    showCloseButton={false}
                    animation='slideUp'
                    duration ='1500'
                >
                    <p className="content-modal">Choose your language</p>
                    <div className="div-button">
                        <Button className="mr15 left-btn" onClick={this.showSecond.bind(this)}>English</Button>
                        <Button className="right-btn" onClick={this.showSecond}>Francais</Button>
                    </div>
                </Rodal>

                <Rodal
                    height = {200}
                    width = {400}
                    visible={this.state.visibleSecond}
                    showCloseButton = {false}
                    animation='slideUp'
                    duration ='1500'
                >
                    <p className="content-modal">Choose your language second</p>
                    <div className="div-button">
                        <Button className="mr15 left-btn" onClick={this.showSecond.bind(this)}>English</Button>
                        <Button className="right-btn" onClick={this.showSecond}>Francais</Button>
                    </div>
                </Rodal>

                <Rodal
                    height = {200}
                    width = {400}
                    visible={this.state.visibleThird}
                    showCloseButton = {false}
                    animation='slideUp'
                    duration ='1500'
                    >
                    <p className="content-modal">Choose your language third</p>
                    <div className="div-button">
                        <Button className="mr15 left-btn" onClick={this.showSecond.bind(this)}>English</Button>
                        <Button className="right-btn" onClick={this.showSecond}>Francais</Button>
                    </div>
                </Rodal> */}
            </div>
        );
    }
}

export default AnimationCircle;
