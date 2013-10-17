(function() {
  var ApiUsageSchema, BusinessSchema, BusinessTagSchema, CollaboratorRequestSchema, EventSchema, EventTagSchema, FeedSchema, MediaSchema, Mixed, ObjectId, OccurrenceSchema, PasswordResetSchema, PostalCodeSchema, PromotionRequestSchema, PromotionTargetSchema, Schema, SocialMediaLinkSchema, UserSchema, WidgetSchema, later, moment, mongoose, _;

  mongoose = require('mongoose');

  Schema = mongoose.Schema;

  ObjectId = mongoose.Schema.ObjectId;

  Mixed = mongoose.Schema.Types.Mixed;

  moment = require('moment');

  later = require('later');

  _ = require('lodash');

  ApiUsageSchema = new mongoose.Schema({
    method: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    apiToken: {
      type: String
    }
  });

  SocialMediaLinkSchema = new Schema({
    target: String,
    url: String
  });

  BusinessSchema = new Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    hours: {
      type: String
    },
    tags: [String],
    website: {
      type: String,
      required: false,
      trim: true
    },
    createdBy: ObjectId,
    media: [
      {
        type: ObjectId,
        ref: 'media'
      }
    ],
    contactName: String,
    contactPhone: String,
    contactEmail: String,
    location: {
      address: {
        type: String,
        required: true
      },
      neighborhood: String,
      geo: {
        'type': {
          type: String,
          required: true,
          "enum": ['Point', 'LineString', 'Polygon'],
          "default": 'Point'
        },
        coordinates: [Number]
      }
    },
    sources: [
      {
        'type': {
          type: String,
          required: true
        },
        sourceId: {
          type: Number,
          required: true
        },
        data: Mixed,
        lastUpdated: {
          type: Date,
          required: true
        }
      }
    ],
    socialMediaLinks: [SocialMediaLinkSchema],
    promotionTargets: [
      {
        type: ObjectId,
        ref: 'promotionTarget'
      }
    ],
    legacyId: String,
    legacyCreatedBy: String
  });

  BusinessTagSchema = new Schema({
    text: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    }
  });

  CollaboratorRequestSchema = new Schema({
    requestDate: Date,
    completedDate: Date,
    businessId: ObjectId,
    email: String
  });

  OccurrenceSchema = new Schema({
    start: Date,
    end: Date
  }, {
    id: false,
    _id: false
  });

  EventSchema = new Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    host: {
      type: ObjectId,
      ref: 'business'
    },
    business: {
      type: ObjectId,
      ref: 'business',
      required: true
    },
    promotionRequests: [
      {
        type: ObjectId,
        ref: 'promotionRequest'
      }
    ],
    tags: [String],
    cost: Number,
    website: {
      type: String,
      required: false,
      trim: true
    },
    bands: [String],
    media: [
      {
        type: ObjectId,
        ref: 'media'
      }
    ],
    contactName: String,
    contactEmail: String,
    contactPhone: String,
    location: {
      address: {
        type: String,
        required: true
      },
      neighborhood: String,
      geo: {
        'type': {
          type: String,
          required: true,
          "enum": ['Point', 'LineString', 'Polygon'],
          "default": 'Point'
        },
        coordinates: [Number]
      }
    },
    ticketUrl: String,
    socialMediaLinks: [SocialMediaLinkSchema],
    fixedOccurrences: [
      {
        start: Date,
        end: Date
      }
    ],
    schedules: [
      {
        hour: Number,
        minute: Number,
        duration: Number,
        dayOfWeekCount: [Number],
        dayOfWeek: [Number],
        start: Date,
        end: Date
      }
    ],
    sources: [
      {
        'type': {
          type: String,
          required: true
        },
        sourceId: {
          type: Number,
          required: true
        },
        data: Mixed,
        lastUpdated: {
          type: Date,
          required: true
        }
      }
    ],
    occurrences: [OccurrenceSchema],
    nextOccurrence: {
      start: Date,
      end: Date
    },
    prevOccurrence: {
      start: Date,
      end: Date
    },
    scheduleText: String,
    legacySchedule: {
      "dayNum": Number,
      "period": Number,
      "periodDay": [Number],
      "ordinal": Number,
      "recurrenceInterval": Number,
      "dayofweek": Number,
      days: String,
      start: Date,
      end: Date,
      hour: Number,
      minute: Number,
      duration: Number
    },
    legacyId: String,
    legacyBusinessId: String,
    legacyHostId: String,
    legacyImage: String,
    tzOffset: Number
  });

  EventSchema.pre('save', function(next) {
    var _this = this;
    return Scheduler.calculate(this, function(err, out) {
      if (!err) {
        if (out.occurrences != null) {
          _this.occurrences = out.occurrences;
        }
        _this.scheduleText = out.scheduleText;
        _this.nextOccurrence = out.nextOccurrence;
        _this.prevOccurrence = out.prevOccurrence;
      }
      return next();
    });
  });

  EventSchema.pre('update', function(next) {
    var _this = this;
    return Scheduler.calculate(this, function(err, out) {
      if (!err) {
        if (out.occurrences != null) {
          _this.occurrences = out.occurrences;
        }
        _this.scheduleText = out.scheduleText;
        _this.nextOccurrence = out.nextOccurrence;
        _this.prevOccurrence = out.prevOccurrence;
      }
      return next();
    });
  });

  EventTagSchema = new Schema({
    text: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    }
  });

  FeedSchema = new mongoose.Schema({
    feedType: {
      type: String,
      "enum": ['BUSINESS', 'EVENT'],
      "default": 'EVENT'
    },
    geo: {
      'type': {
        type: String,
        required: true,
        "enum": ['Point', 'LineString', 'Polygon'],
        "default": 'Point'
      },
      coordinates: [Number]
    },
    radius: Number,
    tags: [String],
    user: ObjectId
  });

  MediaSchema = new Schema({
    url: {
      type: String,
      required: false
    },
    legacyUrl: String,
    user: {
      type: ObjectId,
      ref: 'user'
    }
  });

  PasswordResetSchema = new Schema({
    requestDate: Date,
    completedDate: Date,
    token: String,
    email: String
  });

  PostalCodeSchema = new Schema({
    code: {
      type: String
    },
    city: {
      type: String
    },
    state: {
      type: String
    },
    geo: {
      'type': {
        type: String,
        required: true,
        "enum": ['Point', 'LineString', 'Polygon'],
        "default": 'Point'
      },
      coordinates: [Number]
    }
  });

  PromotionRequestSchema = new mongoose.Schema({
    pushType: String,
    title: String,
    message: String,
    startTime: Date,
    location: String,
    pageId: String,
    pageAccessToken: String,
    ticket_uri: String,
    link: String,
    caption: String,
    promotionTime: Date,
    promotionTarget: {
      type: ObjectId,
      ref: 'promotionTarget'
    },
    media: [
      {
        type: ObjectId,
        ref: 'media'
      }
    ],
    status: {
      postId: String,
      code: {
        type: String,
        "default": 'WAITING',
        "enum": ['WAITING', 'COMPLETE', 'FAILED']
      },
      retryCount: {
        type: Number,
        "default": 0
      },
      lastError: mongoose.Schema.Types.Mixed,
      completedDate: Date
    }
  });

  PromotionTargetSchema = new mongoose.Schema({
    accountType: {
      type: String,
      "enum": ['TWITTER', 'FACEBOOK']
    },
    accessToken: String,
    accessTokenSecret: String,
    profileImageUrl: String,
    profileName: String,
    profileCoverPhoto: String,
    profileId: String,
    expiration: Date
  });

  UserSchema = new Schema({
    userType: {
      type: String,
      "enum": ['BUSINESS', 'PUBLISHER']
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    firstName: String,
    lastName: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    postalCode: String,
    phone: String,
    password: {
      type: String
    },
    encryptionMethod: {
      type: String,
      "enum": ['SHA1', 'BCRYPT']
    },
    businessPrivileges: [
      {
        business: {
          type: ObjectId,
          ref: 'business'
        },
        role: {
          type: String,
          "enum": ['OWNER', 'COLLABORATOR', 'ADMIN_COLLABORATOR']
        }
      }
    ],
    applications: [
      {
        name: String,
        legacyKey: String,
        apiKey: String,
        apiSecret: String,
        privileges: {
          type: String,
          "enum": ['PRIVILEGED', 'STANDARD']
        }
      }
    ],
    authTokens: [
      {
        apiKey: String,
        authToken: String
      }
    ],
    legacyId: String,
    legacyProfiles: [String]
  });

  WidgetSchema = new Schema({
    widgetType: {
      type: String,
      "enum": ["event-by-location", "event-by-business"],
      required: true,
      "default": 'event-by-location'
    },
    name: String,
    filters: Boolean,
    limit: Number,
    location: {
      address: {
        type: String
      },
      neighborhood: String,
      geo: {
        'type': {
          type: String,
          "enum": ['Point', 'LineString', 'Polygon'],
          "default": 'Point'
        },
        coordinates: [Number]
      }
    },
    businesses: [
      {
        type: ObjectId,
        ref: 'business'
      }
    ],
    radius: Number,
    tags: [String],
    user: {
      type: ObjectId,
      ref: 'user'
    },
    height: Number,
    width: Number,
    widgetStyle: {
      type: String,
      "enum": ['dark', 'light']
    },
    accentColor: String
  });

  module.exports.ApiUsage = mongoose.model('apiUsage', ApiUsageSchema, 'apiUsage');

  module.exports.Business = mongoose.model('business', BusinessSchema, 'business');

  module.exports.BusinessTag = mongoose.model("businessTag", BusinessTagSchema, 'businessTag');

  module.exports.CollaboratorRequest = mongoose.model('collaboratorRequest', CollaboratorRequestSchema, 'collaboratorRequest');

  module.exports.Event = mongoose.model('event', EventSchema, 'event');

  module.exports.EventTag = mongoose.model("eventTag", EventTagSchema, 'eventTag');

  module.exports.Feed = mongoose.model('feed', FeedSchema, 'feed');

  module.exports.Media = mongoose.model('media', MediaSchema, 'media');

  module.exports.PasswordReset = mongoose.model('passwordReset', PasswordResetSchema, 'passwordReset');

  module.exports.PostalCode = mongoose.model('postalCode', PostalCodeSchema, 'postalCode');

  module.exports.PromotionRequest = mongoose.model('promotionRequest', PromotionRequestSchema, 'promotionRequest');

  module.exports.PromotionTarget = mongoose.model('promotionTarget', PromotionTargetSchema, 'promotionTarget');

  module.exports.SocialMediaLink = mongoose.model('socialMediaLink', SocialMediaLinkSchema);

  module.exports.User = mongoose.model('user', UserSchema, 'user');

  module.exports.Widget = mongoose.model('widget', WidgetSchema, 'widget');

}).call(this);

(function() {
  var later, makeArray, moment, _;

  moment = require('moment');

  later = require('later');

  _ = require('lodash');

  module.exports.Scheduler.calculate = function(item, cb) {
    var dayCount, e, endRange, m, minutesToAdd, nextOccurrence, now, o, occurrences, out, pastOccurrence, pastOccurrences, s, startRange, transformed, x;
    if (item.schedules.length > 0) {
      out = {};
      occurrences = [];
      dayCount = 60;
      if (item.dayCount) {
        dayCount = item.dayCount;
      }
      now = moment();
      startRange = new Date();
      endRange = new Date();
      startRange = new Date(now);
      x = item.schedules[0];
      transformed = {};
      forLater(x, function(err, result) {
        if (!err) {
          return transformed = result;
        } else {
          return console.log(err);
        }
      });
      if (x.end) {
        endRange = new Date(x.end);
      } else {
        endRange = new Date(moment().add('days', dayCount));
      }
      if (moment(x.start).isAfter(now)) {
        startRange = new Date(x.start);
      } else {
        startRange = new Date(now);
      }
      occurrences = later.schedule({
        schedules: [transformed]
      }).next(dayCount, startRange, endRange);
      occurrences = _.map(occurrences, function(o) {
        var e, m, s;
        m = moment(o);
        s = moment(m.toDate()).toDate();
        e = moment(m.toDate()).add('minutes', x.duration).toDate();
        return {
          start: s,
          end: e
        };
      });
      out.occurrences = occurrences;
      pastOccurrence = later.schedule({
        schedules: [transformed]
      }).prev(1);
      m = moment(pastOccurrence);
      s = moment(m.toDate()).toDate();
      e = moment(m.toDate()).add('minutes', x.duration).toDate();
      pastOccurrence = {
        start: s,
        end: e
      };
      if (pastOccurrence) {
        out.prevOccurrence = pastOccurrence;
      }
      out.scheduleText = scheduleText(item);
      if ((occurrences != null ? occurrences.length : void 0) > 0) {
        out.nextOccurrence = _.first(occurrences);
      }
      return cb(null, out);
    } else {
      minutesToAdd = item.tzOffset - moment().zone();
      o = _.map(item.fixedOccurrences, function(fo) {
        s = moment(fo.start).subtract('minutes', minutesToAdd);
        e = moment(fo.end).subtract('minutes', minutesToAdd);
        return {
          start: s.toDate(),
          end: e.toDate()
        };
      });
      out = {
        occurrences: o,
        scheduleText: ''
      };
      nextOccurrence = _.find(o, function(item) {
        return moment(item.start).isAfter(moment().startOf('day'));
      });
      pastOccurrences = _.filter(o, function(item) {
        return moment(item.start).isBefore(moment().endOf('day'));
      });
      if ((pastOccurrences != null ? pastOccurrences.length : void 0) > 0) {
        out.prevOccurrence = _.last(pastOccurrences);
      }
      out.nextOccurrence = nextOccurrence;
      return cb(null, out);
    }
  };

  module.exports.Scheduler.forLater = function(item, cb) {
    var output, _ref, _ref1, _ref2;
    output = {};
    if ((_ref = item.day) != null ? _ref.length : void 0) {
      output.d = item.day;
    } else if ((_ref1 = item.days) != null ? _ref1.length : void 0) {
      output.d = item.days;
    }
    if (item.h) {
      output.h = makeArray(item.h);
    } else if (item.hour) {
      output.h = makeArray(item.hour);
    }
    if (item.m) {
      output.m = makeArray(item.m);
    } else if (item.minute) {
      output.m = makeArray(item.minute);
    }
    if (item.dayOfWeek) {
      output.dw = makeArray(item.dayOfWeek);
    } else if (item.dw) {
      output.dw = makeArray(item.dw);
    }
    if ((_ref2 = item.dayOfWeekCount) != null ? _ref2.length : void 0) {
      output.dayOfWeekCount = item.dayOfWeekCount;
    }
    if (item.wm) {
      output.wm = item.wm;
    } else if (item.weekOfMonth) {
      output.wm = item.weekOfMonth;
    }
    return cb(null, output);
  };

  makeArray = function(p) {
    if (_.isArray(p)) {
      return p;
    } else {
      return [p];
    }
  };

  module.exports.Scheduler.scheduleText = function(event) {
    var dayCountOrder, dayOrder, days, endDate, out, s, _ref, _ref1, _ref2, _ref3;
    out = "";
    dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    dayCountOrder = ['Last', 'First', 'Second', 'Third', 'Fourth'];
    if ((_ref = event.schedules) != null ? _ref[0] : void 0) {
      s = event.schedules[0];
      s.dayOfWeek = _.sortBy(s.dayOfWeek, function(i) {
        return i;
      });
      endDate = moment(s.end);
      if (((_ref1 = s.dayOfWeek) != null ? _ref1.length : void 0) === 0 && ((_ref2 = s.dayOfWeekCount) != null ? _ref2.length : void 0) === 0) {
        out = 'Every Day';
      } else {
        days = _.map(s.dayOfWeek, function(i) {
          return dayOrder[i - 1];
        });
        if (((_ref3 = s.dayOfWeekCount) != null ? _ref3.length : void 0) > 0) {
          out = "The " + dayCountOrder[s.dayOfWeekCount] + " " + (days.join(', ')) + " of the month";
        } else {
          out = "Every " + (days.join(', '));
        }
        if (s.end) {
          out = "" + out + " until " + (endDate.format('MM/DD/YYYY'));
        } else {
          out = "" + out;
        }
      }
      return out;
    } else {
      return out;
    }
  };

}).call(this);
