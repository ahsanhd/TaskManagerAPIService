import { Kafka, Producer } from "kafkajs";

let producer: Producer | null = null;
let producerReady = false;

function getBrokers() {
  const brokersValue = process.env.KAFKA_BROKERS;
  if (!brokersValue) {
    return null;
  }

  return brokersValue.split(",").map((broker) => broker.trim()).filter(Boolean);
}

async function getKafkaProducer() {
  if (producerReady && producer) {
    return producer;
  }

  const brokers = getBrokers();
  if (!brokers || brokers.length === 0) {
    return null;
  }

  if (!producer) {
    const kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID ?? "task-management-api",
      brokers,
    });

    producer = kafka.producer();
  }

  if (!producerReady) {
    try {
      await producer.connect();
      producerReady = true;
    } catch (error) {
      console.warn("Kafka connection failed:", error);
      producer = null;
      producerReady = false;
      return null;
    }
  }

  return producer;
}

export async function publishTaskEvent(eventType: string, payload: Record<string, unknown>) {
  const topic = process.env.KAFKA_TASK_TOPIC ?? "task-events";
  const kafkaProducer = await getKafkaProducer();

  if (!kafkaProducer) {
    return;
  }

  try {
    await kafkaProducer.send({
      topic,
      messages: [
        {
          value: JSON.stringify({
            eventType,
            payload,
            occurredAt: new Date().toISOString(),
          }),
        },
      ],
    });
  } catch (error) {
    console.warn("Kafka publish failed:", error);
  }
}