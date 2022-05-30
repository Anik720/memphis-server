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
    console.log(req.body);
    // const service = await Service.create(req.body.item);
    // console.log(service);
    const { post } = req.body;
    (async function () {
      try {
        await memphis.connect({
          host: 'localhost',
          port: '6667', // defaults to 6666. Can be removed
          brokerHost: 'localhost',
          brokerPort: '7766', // defaults to 7766. Can be removed
          username: 'kibria', // (application type user)
          connectionToken: 'memphis', // you will get it on application type user creation
          reconnect: true, // defaults to false
          maxReconnect: 1000000, // defaults to 10
          reconnectIntervalMs: 150000000, // defaults to 1500
          timeoutMs: 15000000,
        });

        const producer = await memphis.producer({
          stationName: 'banny',
          producerName: 'harunnn',
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
          stationName: 'banny',
          consumerName: 'Kibriaa',
          consumerGroup: 'anik',
        });

        // consumer.on('message', async (message) => {
        //   console.log(message.getData().toString());
        //   const a = message.getData().toString();
        //   const lexedReview = aposToLexForm(a);
        //   const spellCorrector = new SpellCorrector();
        //   spellCorrector.loadDictionary();
        //   const casedReview = lexedReview.toLowerCase();
        //   const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, '');
        //   //console.log("Helloo",alphaOnlyReview)
        //   const { WordTokenizer } = natural;
        //   const tokenizer = new WordTokenizer();
        //   const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);
        //   //console.log("Helloo",tokenizedReview)
        //   tokenizedReview.forEach((word, index) => {
        //     tokenizedReview[index] = spellCorrector.correct(word);
        //   });
        //   const filteredReview = SW.removeStopwords(tokenizedReview);

        //   const { SentimentAnalyzer, PorterStemmer } = natural;
        //   const analyzer = new SentimentAnalyzer(
        //     'English',
        //     PorterStemmer,
        //     'afinn',
        //   );

        //   const analysis = analyzer.getSentiment(filteredReview);
        //   let messagee;

        //   if (analysis < 0) {
        //     messagee = 'failed';
        //   } else {
        //     await Service.create({ post });
        //     messagee = 'successs';
        //   }
        //   console.log(messagee);
        //   // res.status(201).json({
        //   //   status: 'successs',
        //   //   data: {
        //   //     data: 'data',
        //   //   },
        //   // });
        //   res.seb;
        //   message.ack();
        // });
        Consumer();
        // consumer.on('error', (error) => {
        //   console.log(error);
        // });
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

