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
            visibleFirst: true,
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
            ],
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

    clickStart(){
        this.setState({visibleFirst:false})
        this.setData(this.state.listItem, 0)
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

                    console.log(dataValue)
                    console.log(voiceValue)
                    console.log(orderValue)

                    this.setState({currentItem: array[i], currentIndex:index, 
                        dataValue : dataValue.dataVal[typeData.name], voiceValue : voiceValue.dataVal
                        ,orderValue: orderValue.dataVal, typeData, visible:true})
                    break;
                }
            }
        }
      
    }

    nextModal(){

        if(document.getElementById('audio'))
        {
            document.getElementById('audio').pause()
        }

        this.setState({visible:false})
        setTimeout(() => {
            this.setData(this.state.listItem, this.state.currentIndex + 1)
        }, 500);
    }

    handleEnded()
    {
        if(this.state.dataValue.action_type === 'automatic')
        {
            this.nextModal()
        }
    }

    render() {

        const { visible, visibleFirst, currentItem, dataValue, voiceValue, typeData } = this.state
        return (
            <div className='container'>
                <video autoPlay="autoplay"  loop="loop" muted className='video' >
                    <source src={videoBg} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="div-loading">
                    <LoadingOutlined className="loading-icon" />
                </div>

                <Rodal
                    height={200}
                    width={400}
                    visible={visibleFirst}
                    showCloseButton={false}
                    animation='slideUp'
                    duration ='1500'
                    >

                    <div className="div-button">
                        <Button className="mr15 right-btn" onClick={() => this.clickStart()}>Click to start</Button>
                    </div>
                    </Rodal>
                
                {currentItem ? (
                    <Rodal
                    height={200}
                    width={400}
                    visible={visible}
                    showCloseButton={false}
                    animation='slideUp'
                    duration ='1500'
                    >

                    <audio id="audio" autoPlay="autoplay" onEnded={() => this.handleEnded()} src={voiceValue}></audio>
                    {/* <iframe title='iframe' allow="autoplay" src={voiceValue} style={{display: 'none'}} ></iframe> */}
                    {Array.isArray(dataValue.title) ? (
                        <p className="content-modal">{dataValue.title[0]}</p>
                    ) :(
                        <p className="content-modal">{dataValue.title}</p>
                    )}

                    <div className="div-button">
                        {dataValue.action ? (
                            <Button className="mr15 left-btn" onClick={() => this.nextModal()}>{dataValue.action}</Button>
                        ):''}

                        {dataValue.action_type === "manual" && typeData.value === 2 && dataValue.answer && dataValue.answer.map((item, index)=>(
                            index%2 == 0 ? (
                                <Button key={index} className="mr15 left-btn" onClick={() => this.nextModal()}>{item.field}</Button>
                                ):(
                                <Button key={index} className="mr15 right-btn" onClick={() => this.nextModal()}>{item.field}</Button>
                            )
                        ))}
                    </div>
                    </Rodal>
                ): ''}
            </div>
        );
    }
}

export default AnimationCircle;
