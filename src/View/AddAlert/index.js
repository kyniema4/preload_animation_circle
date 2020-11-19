import React from "react";
import { Button, message, Form, Input } from "antd";
import "./index.css";
import "rodal/lib/rodal.css";
import Rodal from "rodal";
import videoBg from "../../assets/image/video.mp4";
import { LoadingOutlined } from "@ant-design/icons";
import doc from "../../doc.js";
class AnimationCircle extends React.Component {

    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            visibleLoading: true,
            visible: false,
            visibleFirst: false,
            visibleSecond: false,
            visibleThird: false,
            listItem: [],
            currentIndex: 0,
            arrayTypeData: [
                {
                    name: "Type_Message",
                    value: 1
                },
                {
                    name: "Type_Choice",
                    value: 2
                },
                {
                    name: "Type_Input",
                    value: 3
                }
            ],
            arrayAnswer:[]
        };
    }
    componentDidMount() {
        setTimeout(() => {
            this.getListData()
        }, 1000);
        // setTimeout(this.showFirst, 10000);
    }

    getListData() {
        this.setState({ listItem: doc.data.items, visibleLoading: false, visibleFirst: true })
        // fetch('http://localhost:3000/data',{
        //     method: 'GET',
        // }).then(res=>{
        //     return res.json()
        // }).then(res=>{

        //     if(res.items.length)
        //     {
        //         this.setState({listItem: res.items})
        //     }
        //     else
        //     {
        //         message.error('Error from server')
        //     }

        // }).catch(err=>{
        //     console.log(err)
        //     message.error(err.message || 'Error from server')
        // })
    }

    clickStart() {
        this.setState({ visibleFirst: false })
        this.setData(this.state.listItem, 0)
    }

    setData(array, index) {
        for (var i = index; i < array.length; i++) {
            if (array[i].data.length) {
                let dataValue = array[i].data.find((item) => item.dataKey === "Data");
                let voiceValue = array[i].data.find((item) => item.dataKey === "Voice");
                let orderValue = array[i].data.find((item) => item.dataKey === "Order");

                if (dataValue || voiceValue || orderValue) {
                    let typeData;
                    this.state.arrayTypeData.forEach((type) => {
                        if (dataValue.dataVal[type.name]) {
                            typeData = type;
                        }
                    });

                    console.log(dataValue);
                    console.log(voiceValue);
                    console.log(orderValue);

                    this.setState({
                        currentItem: array[i],
                        currentIndex: index,
                        dataValue: dataValue.dataVal[typeData.name],
                        voiceValue: voiceValue.dataVal,
                        orderValue: orderValue.dataVal,
                        typeData,
                        visible: true,
                        visibleLoading: false,
                    });
                    break;
                }
            }
        }

        if(i === array.length)
        {
            console.log(this.state.arrayAnswer)
            this.setState({visibleLoading: false})
            alert(JSON.stringify(this.state.arrayAnswer))
        }
    }

    nextModal() {
        if (document.getElementById("audio")) {
            document.getElementById("audio").pause();
        }

        this.setState({ visible: false, visibleLoading: true });
        setTimeout(() => {
            this.setData(this.state.listItem, this.state.currentIndex + 1);
        }, 500);
    }

    handleEnded() {
        if (this.state.dataValue.action_type === "automatic") {
            this.nextModal();
        }
    }

    handlingChoice(data){
        let answer = {itemId: this.state.currentItem.itemId, type: this.state.typeData.name, answer:data}
        this.pushData(answer)
    }

    pushData(answer){
        this.state.arrayAnswer.push(answer)
        this.nextModal()
    }

    onSubmit(){
        if(this.state.typeData.value === 3)
        {
            this.formRef.current.validateFields().then(data=>{
                let answer = {itemId: this.state.currentItem.itemId, type: this.state.typeData.name, answer:data}
                this.pushData(answer)
            }).catch(err=>{
                console.log(err)
            })
        }
        else
        {
            this.nextModal()
        }

    }

    onClose(){
        console.log(1)
    }
  render() {
    const {
      visible,
      visibleFirst,
      currentItem,
      dataValue,
      voiceValue,
      typeData,
      visibleLoading,
    } = this.state;
    return (
      <div className="container">
          <video
              autoPlay="autoplay"
              loop="loop"
              preload="yes"
              playsInline
              muted={true}
              className="video">
              <source src={videoBg} type="video/mp4" />
              Your browser does not support the video tag.
          </video>
          {visibleLoading ? (
              <div className="div-loading">
                  <LoadingOutlined className="loading-icon" />
              </div>
          ) : (
              ""
          )}

        <Rodal
          height={200}
          width={400}
          visible={visibleFirst}
          showCloseButton={false}
          animation="slideUp"
          duration="1500"
          onClose={()=>this.onClose()}
        >
            <div className="m-auto">
                <div className="div-button">
                    <Button
                        className="right-btn"
                        onClick={() => this.clickStart()}
                    >
                        Click to start
                    </Button>
                </div>
            </div>
        </Rodal>

        {currentItem ? (
          <Rodal
            height={200}
            width={400}
            visible={visible}
            showCloseButton={false}
            animation="slideUp"
            duration="1500"
            onClose={()=>this.onClose()}
          >
            <audio
              id="audio"
              autoPlay="autoplay"
              onEnded={() => this.handleEnded()}
              src={voiceValue}
            ></audio>
            {/* <iframe title='iframe' allow="autoplay" src={voiceValue} style={{display: 'none'}} ></iframe> */}
              <div className="m-auto">
                  <div className="mb15">
                      {Array.isArray(dataValue.title) ? (
                          <p className="content-modal">{dataValue.title[0]}</p>
                      ) : (
                          <p className="content-modal">{dataValue.title}</p>
                      )}
                      {typeData.value === 3 ? (
                          <Form ref={this.formRef} className="form-style">
                              <Form.Item
                                  className="ant-form-item"
                                  name="answer"
                                  rules={[
                                      {
                                          required: true,
                                          message: 'Please input answer!'
                                      },
                                  ]}
                              >
                                  <Input/>
                              </Form.Item>
                          </Form>
                      ) : (
                          ""
                      )}
                  </div>

            <div className="div-button">
              {dataValue.action ? (
                <Button
                  className="left-btn"
                  onClick={() => this.onSubmit()}
                >
                  {dataValue.action}
                </Button>
              ) : (
                ""
              )}

                {dataValue.action_type==="automatic" ? (
                    <Button className="left-btn" onClick={() => this.nextModal()}>Skip</Button>
                ):''}

              {dataValue.action_type === "manual" &&
                typeData.value === 2 &&
                dataValue.answer &&
                dataValue.answer.map((item, index) =>
                    dataValue.answer.length > 2 ?
                    (
                    <Button
                      key={index}
                      className="left-btn"
                      onClick={() => this.handlingChoice(item)}
                    >
                      {item.field}
                    </Button>
                  ) :index % 2 === 0 ? (
                    <Button
                      key={index}
                      className="right-btn"
                      onClick={() => this.handlingChoice(item)}
                    >
                      {item.field}
                    </Button>
                  ) : (
                            <Button
                                key={index}
                                className="right-btn"
                                onClick={() => this.handlingChoice(item)}
                            >
                                {item.field}
                            </Button>
                        )
                )}
                </div>
              </div>
          </Rodal>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default AnimationCircle;
