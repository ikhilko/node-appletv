import * as caporal from 'caporal';
let cli = caporal as any;

import { AppleTV } from '../lib/appletv';
import { Credentials } from '../lib/credentials';
import { NowPlayingInfo } from '../lib/now-playing-info';
import { Message } from '../lib/message';
import { scan } from './scan';
import { pair } from './pair';

cli
  .version('1.0.0')
  .command('pair', 'Pair with an AppleTV')
  .action((args, options, logger) => {
    scan(logger)
      .then(device => {
        device.on('debug', (message: string) => {
          logger.debug(message);
        });
        device.on('error', (error: Error) => {
          logger.error(error.message);
          logger.debug(error.stack);
        });
        return pair(device, logger)
          .then(keys => {
            logger.info("Success! Credentials: " + device.credentials.toString());
            process.exit();
          });
      })
      .catch(error => {
        logger.error(error.message);
        logger.debug(error.stack);
        process.exit();
      });
  });

cli
  .version('1.0.0')
  .command('command', 'Send a command to an AppleTV')
  .argument('<command>', 'The command to send', /^up|down|left|right|menu|play|pause|next|previous|suspend$/)
  .option('--credentials <credentials>', 'The device credentials from pairing', cli.STRING) 
  .action((args, options, logger) => {
    if (!options.credentials) {
      logger.error("Credentials are required. Pair first.");
      process.exit();
    }
    let credentials = Credentials.parse(options.credentials);
    scan(logger, credentials.uniqueIdentifier)
      .then(device => {
        device.on('debug', (message: string) => {
          logger.debug(message);
        });
        device.on('error', (error: Error) => {
          logger.error(error.message);
          logger.debug(error.stack);
        });
        return device
          .openConnection(credentials)
          .then(() => {
            return device
              .sendKeyCommand(AppleTV.key(args["command"]))
              .then(result => {
                logger.info("Success!");
                process.exit();
              });
           });
      })
      .catch(error => {
        logger.error(error.message);
        logger.debug(error.stack);
        process.exit();
      });
  });

cli
  .version('1.0.0')
  .command('state', 'Logs the playback state from the AppleTV')
  .option('--credentials <credentials>', 'The device credentials from pairing', cli.STRING) 
  .action((args, options, logger) => {
    if (!options.credentials) {
      logger.error("Credentials are required. Pair first.");
      process.exit();
    }
    let credentials = Credentials.parse(options.credentials);
    scan(logger, credentials.uniqueIdentifier)
      .then(device => {
        device.on('debug', (message: string) => {
          logger.debug(message);
        });
        device.on('error', (error: Error) => {
          logger.error(error.message);
          logger.debug(error.stack);
        });
        return device
          .openConnection(credentials);
      })
      .then(device => {
        device.on('nowPlaying', (info: NowPlayingInfo) => {
          logger.info(info.toString());
        });
      })
      .catch(error => {
        logger.error(error.message);
        logger.debug(error.stack);
        process.exit();
      });
  });

cli
  .version('1.0.0')
  .command('supportedCommands', 'Logs the playback state from the AppleTV')
  .option('--credentials <credentials>', 'The device credentials from pairing', cli.STRING) 
  .action((args, options, logger) => {
    if (!options.credentials) {
      logger.error("Credentials are required. Pair first.");
      process.exit();
    }
    let credentials = Credentials.parse(options.credentials);
    scan(logger, credentials.uniqueIdentifier)
      .then(device => {
        device.on('debug', (message: string) => {
          logger.debug(message);
        });
        device.on('error', (error: Error) => {
          logger.error(error.message);
          logger.debug(error.stack);
        });
        return device
          .openConnection(credentials);
      })
      .then(device => {
        device.on('supportedCommands', (info: any[]) => {
          logger.info(info);
        });
      })
      .catch(error => {
        logger.error(error.message);
        logger.debug(error.stack);
        process.exit();
      });
  });

cli
  .version('1.0.0')
  .command('queue', 'Request the playback state from the AppleTV')
  .option('--credentials <credentials>', 'The device credentials from pairing', cli.STRING) 
  .option('--location <location>', 'The location in the queue', cli.INTEGER) 
  .option('--length <length>', 'The length of the queue', cli.INTEGER) 
  .option('--metadata', 'Include metadata', cli.BOOLEAN) 
  .option('--lyrics', 'Include lyrics', cli.BOOLEAN) 
  .option('--languages', 'Include language options', cli.BOOLEAN) 
  .action((args, options, logger) => {
    if (!options.credentials) {
      logger.error("Credentials are required. Pair first.");
      process.exit();
    }
    let credentials = Credentials.parse(options.credentials);
    scan(logger, credentials.uniqueIdentifier)
      .then(device => {
        device.on('debug', (message: string) => {
          logger.debug(message);
        });
        device.on('error', (error: Error) => {
          logger.error(error.message);
          logger.debug(error.stack);
        });
        return device
          .openConnection(credentials);
      })
      .then(device => {
        return device
          .requestPlaybackQueue({
            location: options.location || 0,
            length: options.length || 1,
            includeMetadata: options.metadata,
            includeLyrics: options.lyrics,
            includeLanguageOptions: options.languages
          });
      })
      .then(message => {
        logger.info(message);
      })
      .catch(error => {
        logger.error(error.message);
        logger.debug(error.stack);
        process.exit();
      });
  });

cli
  .version('1.0.0')
  .command('messages', 'Log all messages sent from the AppleTV')
  .option('--credentials <credentials>', 'The device credentials from pairing', cli.STRING) 
  .action((args, options, logger) => {
    if (!options.credentials) {
      logger.error("Credentials are required. Pair first.");
      process.exit();
    }
    let credentials = Credentials.parse(options.credentials);
    scan(logger, credentials.uniqueIdentifier)
      .then(device => {
        device.on('debug', (message: string) => {
          logger.debug(message);
        });
        device.on('error', (error: Error) => {
          logger.error(error.message);
          logger.debug(error.stack);
        });
        return device
          .openConnection(credentials);
      })
      .then(device => {
        device.on('message', (message: Message) => {
          logger.info(JSON.stringify(message.toObject(), null, 2));
        });
      })
      .catch(error => {
        logger.error(error.message);
        logger.debug(error.stack);
        process.exit();
      });
  });

cli.parse(process.argv);