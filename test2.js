// Import TensorFlow.js library
// const tf = require('@tensorflow/tfjs');
// const tf = requestAnimationFrame('@tensofr')

// Define the training data
const xTrain = tf.tensor2d([[1], [2], [3], [4]], [4, 1]);
const yTrain = tf.tensor2d([[3], [5], [7], [9]], [4, 1]);

// Define the model architecture
const model = tf.sequential();
model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

// Compile the model
model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

// Train the model
model.fit(xTrain, yTrain, { epochs: 100 })
  .then(() => {
    // Perform inference/prediction
    const xTest = tf.tensor2d([[5], [6]]);
    const predictions = model.predict(xTest);

    // Print the predictions
    predictions.print();
  });
