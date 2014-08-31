destoroyah.karma = {};

destoroyah.karma.reporter = function(karma) {
  return function(bitterStruggle) {
    var timer;
    timer = null;
    bitterStruggle.on('start', function() {
      return karma.info({
        total: bitterStruggle.monsters.reduce((function(acc, m) {
          return acc + m.rampages.length;
        }), 0),
        specs: bitterStruggle.monsters.reduce((function(acc, m) {
          return acc.concat(m.rampages.map(function(r) {
            return r.reason;
          }));
        }), [])
      });
    });
    bitterStruggle.on('end', function() {
      return karma.complete();
    });
    bitterStruggle.on('start rampage', function(monster, rampage) {
      if (timer) {
        clearInterval(timer);
      }
      return timer = setInterval(function() {
        return karma.info('Long running rampage "' + rampage.reason + '" of "' + monster.reason + '"...');
      }, 9000);
    });
    bitterStruggle.on('end rampage', function(monster, rampage, destResult) {
      var result;
      if (timer) {
        clearInterval(timer);
      }
      timer = null;
      result = {
        description: rampage.reason + ' (' + destResult.angryness + ' [+' + destResult.combos + '])',
        skipped: false,
        success: !destResult.failed,
        suite: [monster.reason],
        time: destResult.time,
        id: rampage.id
      };
      result.log = destResult.failed ? ['Defeated by the monster with attack : ' + destoroyah.modules.util.argFormat(destResult.lastArguments)] : [];
      if (rampage.inspected) {
        result.description += ' » ' + destoroyah.modules.util.argFormat([rampage.inspectedVal]);
      }
      return karma.result(result);
    });
    return bitterStruggle.on('error rampage', function(monster, rampage, error) {
      var msg, result;
      msg = 'Found a weak spot, fight ended unfair with error ' + error;
      if (error.__destoroyah != null) {
        msg += '\nfought with arguments ' + destoroyah.modules.util.argFormat(error.__destoroyah);
      }
      result = {
        description: rampage.reason,
        skipped: false,
        success: false,
        suite: [monster.reason],
        id: rampage.id,
        log: [msg],
        time: 0
      };
      return karma.result(result);
    });
  };
};

window.__karma__.start = function(config) {
  destoroyah.karma.reporter(window.__karma__)(destoroyah.bitterStruggle);
  return destoroyah.bitterStruggle.fight();
};
