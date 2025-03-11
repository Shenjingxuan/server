const mqtt = require('mqtt');

class MqttClient {
    constructor() {
        this.client = null;
    }

    connect() {
        if (!this.client) {
            this.client = mqtt.connect('mqtt://localhost:1883');
            
            this.client.on('connect', () => {
                console.log('MQTT Connected');
                this.client.subscribe('test/#', (err) => {
                    if (!err) {
                        console.log('Subscribed to test/#');
                    }
                });
            });

            this.client.on('error', (error) => {
                console.error('MQTT Error:', error);
            });

            this.client.on('message', (topic, message) => {
                console.log(`Received message on ${topic}: ${message.toString()}`);
            });
        }
        return this.client;
    }

    async disconnect() {
        if (this.client) {
            await new Promise(resolve => this.client.end(true, {}, resolve));
            this.client = null;
        }
    }

    getClient() {
        return this.client || this.connect();
    }

    publish(topic, message) {
        return new Promise((resolve, reject) => {
            this.getClient().publish(topic, message, (error) => {
                if (error) reject(error);
                else resolve();
            });
        });
    }

    subscribe(topic) {
        return new Promise((resolve, reject) => {
            this.getClient().subscribe(topic, (error) => {
                if (error) reject(error);
                else resolve();
            });
        });
    }
}

module.exports = new MqttClient();