import React from 'react';
import { Button } from 'antd';
import './index.css';
import 'rodal/lib/rodal.css';
import Rodal from 'rodal';
import videoBg from '../../assets/image/video.mp4';
import { LoadingOutlined } from '@ant-design/icons';

class AnimationCircle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visibleFirst: false,
            visibleSecond: false,
            visibleThird: false,
        };
    }
    componentDidMount() {
        this.getListData()
        setTimeout(this.showFirst, 10000);
    }

    getListData() {
        fetch('http://localhost:3000/data',{
            method: 'GET',
        }).then(res=>{
            return res.json()
        }).then(res=>{
            this.setState({listItem: res.items})
            console.log(this.state.listItem)
        }).catch(err=>{
            console.log(err)
        })
    }

    showFirst = () => {
        this.setState({ visibleFirst: true });
    }
    showSecond = () => {
        setTimeout((
            this.setState({
                visibleFirst: false,
                visibleSecond: true
            })
        ), 5000);
    }
    showThird = () => {
        setTimeout((
            this.setState({
                visibleSecond: false,
                visibleThird: true
            })
        ), 5000);
    }

    hideThird = () => {
        this.setState({ visibleThird: false });
    }

    render() {
        return (
            <div className='container'>
                <video autoPlay="autoplay" loop="loop" muted className='video' >
                    <source src={videoBg} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="div-loading">
                    <LoadingOutlined className="loading-icon" />
                </div>

                <Rodal
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
                    </Rodal>
            </div>
        );
    }
}

export default AnimationCircle;
