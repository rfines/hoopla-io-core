(function() {
  var ApiUsageSchema, mongoose;

  mongoose = require('mongoose');

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

  module.exports = {
    ApiUsage: mongoose.model('apiUsage', ApiUsageSchema, 'apiUsage')
  };

}).call(this);

(function() {
  var BusinessSchema, Contact, Media, ObjectId, Schema, SocialMediaLink, mongoose;

  mongoose = require('mongoose');

  Schema = mongoose.Schema;

  ObjectId = mongoose.Schema.ObjectId;

  Contact = require('./contact');

  Media = require('./media').MediaSchema;

  SocialMediaLink = require('./socialMediaLink').SocialMediaLinkSchema;

  require('./promotionTarget').PromotionTargetSchema;

  BusinessSchema = new Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
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
    socialMediaLinks: [SocialMediaLink],
    promotionTargets: [
      {
        type: ObjectId,
        ref: 'promotionTarget'
      }
    ],
    legacyId: String,
    legacyCreatedBy: String
  });

  module.exports = {
    Business: mongoose.model('business', BusinessSchema, 'business'),
    BusinessSchema: BusinessSchema
  };

}).call(this);

(function() {
  var BusinessTagSchema, ObjectId, Schema, mongoose;

  mongoose = require('mongoose');

  Schema = mongoose.Schema;

  ObjectId = mongoose.Schema.ObjectId;

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

  module.exports = {
    EventCategory: mongoose.model("businessTag", BusinessTagSchema, 'businessTag')
  };

}).call(this);

(function() {
  var CollaboratorRequestSchema, ObjectId, Schema, mongoose;

  mongoose = require('mongoose');

  Schema = mongoose.Schema;

  ObjectId = mongoose.Schema.ObjectId;

  CollaboratorRequestSchema = new Schema({
    requestDate: Date,
    completedDate: Date,
    businessId: ObjectId,
    email: String
  });

  module.exports = {
    CollaboratorRequest: mongoose.model('collaboratorRequest', CollaboratorRequestSchema, 'collaboratorRequest'),
    CollaboratorRequestSchema: CollaboratorRequestSchema
  };

}).call(this);

(function() {
  var ContactSchema, ObjectId, Schema, mongoose;

  mongoose = require('mongoose');

  Schema = mongoose.Schema;

  ObjectId = mongoose.Schema.ObjectId;

  ContactSchema = new Schema({
    name: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true
    }
  });

  module["export"] = {
    Contact: mongoose.model('contact', ContactSchema),
    ContactSchema: ContactSchema
  };

}).call(this);

(function() {
  var Business, Contact, EventSchema, Media, ObjectId, OccurrenceSchema, PromotionRequest, Schema, SocialMediaLinks, mongoose;

  mongoose = require('mongoose');

  Schema = mongoose.Schema;

  ObjectId = mongoose.Schema.ObjectId;

  Media = require('./media').MediaSchema;

  Contact = require('./contact').ContactSchema;

  SocialMediaLinks = require('./socialMediaLink').SocialMediaLinkSchema;

  Business = require('./business').BusinessSchema;

  PromotionRequest = require('./promotionRequest').PromtionRequestSchema;

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
      required: true,
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
    socialMediaLinks: [SocialMediaLinks],
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

  /*
  EventSchema.pre 'save', (next) ->
    scheduleService = require('../services/schedulingService')
    scheduleService.calculate @, (err, out) =>
      if not err
        @occurrences = out.occurrences if out.occurrences?
        @scheduleText = out.scheduleText
        @nextOccurrence = out.nextOccurrence
        @prevOccurrence = out.prevOccurrence
      next()
  EventSchema.pre 'update', (next) ->
    scheduleService = require('../services/schedulingService')
    scheduleService.calculate @, (err, out) =>
      if not err
        @occurrences = out.occurrences if out.occurrences?
        @scheduleText = out.scheduleText
        @nextOccurrence = out.nextOccurrence
        @prevOccurrence = out.prevOccurrence      
      next()
  */


  module.exports = {
    Event: mongoose.model('event', EventSchema, 'event'),
    EventSchema: EventSchema
  };

}).call(this);

(function() {
  var EventTagSchema, ObjectId, Schema, mongoose;

  mongoose = require('mongoose');

  Schema = mongoose.Schema;

  ObjectId = mongoose.Schema.ObjectId;

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

  module.exports = {
    EventTag: mongoose.model("eventTag", EventTagSchema, 'eventTag')
  };

}).call(this);

(function() {
  var FeedSchema, ObjectId, mongoose;

  mongoose = require('mongoose');

  ObjectId = mongoose.Schema.ObjectId;

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

  module.exports = {
    Feed: mongoose.model('feed', FeedSchema, 'feed'),
    FeedSchema: FeedSchema
  };

}).call(this);

(function() {
  var MediaSchema, ObjectId, Schema, mongoose;

  mongoose = require('mongoose');

  Schema = mongoose.Schema;

  ObjectId = mongoose.Schema.ObjectId;

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

  module.exports = {
    Media: mongoose.model('media', MediaSchema, 'media'),
    MediaSchema: MediaSchema
  };

}).call(this);

(function() {
  var ObjectId, PasswordResetSchema, Schema, mongoose;

  mongoose = require('mongoose');

  Schema = mongoose.Schema;

  ObjectId = mongoose.Schema.ObjectId;

  PasswordResetSchema = new Schema({
    requestDate: Date,
    completedDate: Date,
    token: String,
    email: String
  });

  module.exports = {
    PasswordReset: mongoose.model('passwordReset', PasswordResetSchema, 'passwordReset'),
    PasswordResetSchema: PasswordResetSchema
  };

}).call(this);

(function() {
  var ObjectId, PostalCodeSchema, Schema, mongoose;

  mongoose = require('mongoose');

  Schema = mongoose.Schema;

  ObjectId = mongoose.Schema.ObjectId;

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

  module.exports = {
    PostalCode: mongoose.model('postalCode', PostalCodeSchema, 'postalCode')
  };

}).call(this);

(function() {
  var ObjectId, PromotionRequestSchema, mongoose;

  mongoose = require('mongoose');

  ObjectId = mongoose.Schema.ObjectId;

  require('./promotionTarget').PromotionTargetSchema;

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

  module.exports = {
    PromotionRequest: mongoose.model('promotionRequest', PromotionRequestSchema, 'promotionRequest'),
    PromotionRequestSchema: PromotionRequestSchema
  };

}).call(this);

(function() {
  var ObjectId, PromotionTargetSchema, mongoose;

  mongoose = require('mongoose');

  ObjectId = mongoose.Schema.ObjectId;

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

  module.exports = {
    PromotionTarget: mongoose.model('promotionTarget', PromotionTargetSchema, 'promotionTarget'),
    PromotionTargetSchema: PromotionTargetSchema
  };

}).call(this);

(function() {
  var ObjectId, Schema, SocialMediaLinkSchema, mongoose;

  mongoose = require('mongoose');

  Schema = mongoose.Schema;

  ObjectId = mongoose.Schema.ObjectId;

  SocialMediaLinkSchema = new Schema({
    target: String,
    url: String
  });

  module["export"] = {
    SocialMediaLink: mongoose.model('socialMediaLink', SocialMediaLinkSchema),
    SocialMediaLinkSchema: SocialMediaLinkSchema
  };

}).call(this);

(function() {
  var Business, ObjectId, Schema, UserSchema, mongoose;

  mongoose = require('mongoose');

  Schema = mongoose.Schema;

  ObjectId = mongoose.Schema.ObjectId;

  Business = require('./business').BusinessSchema;

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

  module.exports = {
    User: mongoose.model('user', UserSchema, 'user')
  };

}).call(this);

(function() {
  var Business, ObjectId, Schema, User, WidgetSchema, mongoose;

  mongoose = require('mongoose');

  Schema = mongoose.Schema;

  ObjectId = mongoose.Schema.ObjectId;

  Business = require('./business').BusinessSchema;

  User = require('./user').UserSchema;

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

  module.exports = {
    Widget: mongoose.model('widget', WidgetSchema, 'widget'),
    WidgetSchema: WidgetSchema
  };

}).call(this);
