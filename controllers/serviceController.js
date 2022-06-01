const Service = require('../models/serviceModel');
const memphis = require('memphis-dev');
const natural = require('natural');
const Consumer = require('./Consumer');
const SpellCorrector = require('spelling-corrector');
const aposToLexForm = require('apos-to-lex-form');
const SW = require('stopword');

exports.getAllServices = async (req, res, next) => {
  try {
    const services = await Service.find();

    res.status(200).json({
      message: 'Success',
      data: {
        services,
      },
    });
  } catch (err) {
    res.status(404).json({
      message: 'failed',
    });
  }
};

exports.careteService = async (req, res) => {
  try {
    const { post } = req.body;
    console.log('post' + post);
    (async function () {
      try {
        await memphis.connect({
          host: 'localhost',

          username: 'karim', // (application type user)
          connectionToken: 'memphis', // you will get it on application type user creation
          dataPort: 2000,
        });
        const aa = post;
        const lexedReview = aposToLexForm(aa);
        const spellCorrector = new SpellCorrector();
        spellCorrector.loadDictionary();
        const casedReview = lexedReview.toLowerCase();
        const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, '');
        //console.log("Helloo",alphaOnlyReview)
        const { WordTokenizer } = natural;
        const tokenizer = new WordTokenizer();
        const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);
        //console.log("Helloo",tokenizedReview)
        tokenizedReview.forEach((word, index) => {
          tokenizedReview[index] = spellCorrector.correct(word);
        });
        const filteredReview = SW.removeStopwords(tokenizedReview);

        const { SentimentAnalyzer, PorterStemmer } = natural;
        const analyzer = new SentimentAnalyzer(
          'English',
          PorterStemmer,
          'afinn',
        );

        const analysis = analyzer.getSentiment(filteredReview);
        console.log(analysis);
        let messagee;

        if (analysis < 0) {
          res.send({ messagee: 'failed' });
        } else {
          await Service.create({ post });
          res.send({ messagee: 'success' });
        }
        console.log('message', messagee);
        const producer = await memphis.producer({
          stationName: 'darun',
          producerName: 'kadir',
        });

        const promises = [];
        const a = 'anik';
        for (let index = 0; index < 1; index++)
          promises.push(
            producer.produce({
              message: Buffer.from(post),
            }),
          );

        await Promise.all(promises);
        const consumer = await memphis.consumer({
          stationName: 'darun',
          consumerName: 'Kibriaaa',
          consumerGroup: 'anik',
        });

        consumer.on('message', async (message) => {
          console.log('Hello boy', message.getData().toString());

          res.seb;
          message.ack();
        });
        //Consumer();
        memphis.close();
        consumer.on('error', (error) => {
          console.log(error);
        });
      } catch (ex) {
        console.log(ex);
        memphis.close();
      }
    })();
  } catch (err) {
    res.status(404).json({
      message: 'failed',
    });
  }
};

