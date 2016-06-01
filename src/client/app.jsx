var BluetoothList = React.createClass({
    getInitialState: function () {
        return {
            devices: {},
            stickers: {},
            counter: 0
        };
    },
    counter: function () {
        this.setState(
            Object.assign({}, this.state, {
                counter: this.state.counter + 1
            })
        )
    },
    componentDidMount: function () {
        var that = this;

        that.socket = io.connect(location.host);
        that.socket.on('enter', function(data) {
            var stickers = that.state.stickers
            var devices = that.state.devices
            var newDevice = {}
            newDevice[data.id] = data
            newDevice[data.id].timestamp = new Date()

            if (data.type == 'sticker'){
                stickers = Object.assign({}, stickers, newDevice)
            } else {
                devices = Object.assign({}, devices, newDevice)
            }

            that.setState(
                Object.assign({}, that.state, {
                        devices: devices,
                        stickers: stickers,
                        counter: 0
                    }
                )
            );
        });

        this.timer = setInterval(this.counter, 1000)
    },

    componentWillUnmount: function(){
        clearInterval(this.timer);
    },

    render: function() {

        return (
            <div className={"List"}>
                <h4>{this.state.counter}</h4>
                <h3>Stickers:</h3>
                <DevicesList type="sticker" data={this.state.stickers}/>
                <h3>Devices:</h3>
                <DevicesList type="device" data={this.state.devices}/>
            </div>
        );
    }
});

var DevicesList = React.createClass({
    renderHeader: function () {
        if (this.props.type == 'sticker'){
            return (<tr>
                <th>id</th>
                <th>Temperature</th>
                <th>Is movement</th>
                <th>Acceleration</th>
                <th>Battery</th>
                <th>Power</th>
                <th>Current Motion</th>
                <th>Previous Motion</th>
                <th>RSSI</th>
                <th>Timestamp</th>
            </tr>);
        } else {
            return (<tr>
                <th>id</th>
                <th>Name</th>
                <th>RSSI</th>
                <th>Conectable</th>
                <th>Timestamp</th>
            </tr>);
        }
    },
    renderList: function () {
        var Devices = [];
        var devs = this.props.data
        for (var k in devs) {
            if (devs.hasOwnProperty(k)) {
                var device = devs[k];
                var timestamp = moment(device.timestamp).format("DD MM YYYY, h:mm:ss a");
                if (this.props.type == 'sticker'){
                    Devices.push(<tr key={device.id}>
                        <td>{device.id}</td>
                        <td>{device.temperature}</td>
                        <td>{(device.moving) ? 1:0}</td>
                        <td>{device.acceleration.x} {device.acceleration.y} {device.acceleration.z}</td>
                        <td>{device.batteryLevel}</td>
                        <td>{device.power}</td>
                        <td>{device.currentMotionStateDuration}</td>
                        <td>{device.previousMotionStateDuration}</td>
                        <td>{device.raw.rssi}</td>
                        <td>{timestamp}</td>
                    </tr>);
                } else {
                    var localName = (device.advertisement && device.advertisement.localName) ? device.advertisement.localName : 'Unknown';
                    Devices.push(<tr key={device.id}>
                        <td>{device.id}</td>
                        <td>{localName}</td>
                        <td>{device.rssi}</td>
                        <td>{(device.connectable) ? 1:0}</td>
                        <td>{timestamp}</td>
                    </tr>);
                }
            }
        }
        console.log(Devices)
        return Devices;
    },
    render: function () {
        var Devices = []
        Devices = this.renderList()
        if (Devices.length < 1){
            Devices = (<tr><th>Scanning...</th><th>.</th><th>.</th></tr>);
        }
        return (
            <table className={"table table-striped"}>
                <thead>
                    {this.renderHeader()}
                </thead>
                <tbody>
                    {Devices}
                </tbody>
            </table>
        );
    }
});

React.render(
    <BluetoothList/>,
    document.getElementById('content')
);
