mongoose = require('mongoose')
Schema = mongoose.Schema
ObjectId = mongoose.Schema.ObjectId
Mixed = mongoose.Schema.Types.Mixed
moment = require 'moment'
later = require 'later'
_ = require 'lodash'

AggregationJobSchema = new mongoose.Schema
  name: String
  provider: String
  postalCode : String
  nextRun: Date
  lastRun: Date

ApiUsageSchema = new mongoose.Schema
  method:
    type: String
    required: true
  url:
    type: String
    required: true
  status:
    type: String
    required: true
  apiToken:
    type:String        

SocialMediaLinkSchema = new Schema
  target: String
  url: String  

BusinessSchema = new Schema
  name: 
    type: String
    required: true
    trim: true
  description:
    type: String
    trim: true
  hours:
    type: String
  tags:[String]
  website:
    type: String
    required: false
    trim: true
  createdBy: ObjectId
  media:[{type : ObjectId, ref : 'media'}]
  contactName: String
  contactPhone: String
  contactEmail: String
  location: {
    address: {type: String, required: true}
    neighborhood : String
    geo: {
      'type':
        type: String,
        required: true,
        enum: ['Point', 'LineString', 'Polygon'],
        default: 'Point'
      coordinates: [Number]
    }    
  }
  sources:[
    {
      sourceType:
        type:String
        required:true
        default: 'hoopla'
      sourceId: 
        type:String
      data:Mixed
    }
  ]    
  socialMediaLinks:[SocialMediaLinkSchema]
  promotionTargets: [{type:ObjectId, ref : 'promotionTarget'}]
  legacyId: String
  legacyCreatedBy: String    

BusinessTagSchema = new Schema
  text:
    type: String
    required: true
    trim: true
  slug:
    type: String
    required: true
    trim: true
    uppercase: true

CollaboratorRequestSchema = new Schema
  requestDate : Date
  completedDate : Date
  businessId : ObjectId
  email : String


OccurrenceSchema = new Schema
  start: Date
  end: Date
,
  id: false
  _id : false

EventSchema = new Schema
  name: 
    type: String
    required: true
    trim: true
  description:
    type: String
    trim: true
  host: {type:ObjectId, ref:'business'}
  business : {type:ObjectId, ref:'business', required:true}
  promotionRequests:[{type:ObjectId, ref:'promotionRequest'}]
  tags: [String]
  cost: Number
  website:
    type: String
    required: false
    trim: true
  bands: [String]
  media:[{type : ObjectId, ref : 'media'}]
  contactName: String
  contactEmail: String
  contactPhone: String
  location: {
    address: {type: String, required: true}
    neighborhood : String
    geo: {
      'type':
        type: String,
        required: true,
        enum: ['Point', 'LineString', 'Polygon'],
        default: 'Point'
      coordinates: [Number]
    }
  }    
  ticketUrl: String
  socialMediaLinks: [SocialMediaLinkSchema]
  fixedOccurrences: [
    {
      start: Date
      end: Date
    }
  ]  
  schedules: [
    {
      hour: Number
      minute:Number
      duration:Number
      dayOfWeekCount : [Number]
      dayOfWeek: [Number]
      start: Date
      end: Date
    }
  ]
  sources:[
    {
      sourceType:
        type:String
        required:true
        default: 'hoopla'
      sourceId: 
        type:String
      data: Mixed
    }
  ]    
  occurrences:[OccurrenceSchema]
  nextOccurrence: {start: Date, end:Date}
  prevOccurrence: {start: Date, end:Date}
  scheduleText: String
  legacyId: String
  tzOffset : Number  
  curatorApproved: Boolean
  createUser: {type:ObjectId, ref:'user'}
  createDate: 
    type: Date
    default: Date.now

EventSchema.pre 'save', (next) ->
  module.exports.Scheduler.calculate @, (err, out) =>
    if not err
      @occurrences = out.occurrences if out.occurrences?
      @scheduleText = out.scheduleText
      @nextOccurrence = out.nextOccurrence
      @prevOccurrence = out.prevOccurrence
    next()
EventSchema.pre 'update', (next) ->
  module.exports.Scheduler.calculate @, (err, out) =>
    if not err
      @occurrences = out.occurrences if out.occurrences?
      @scheduleText = out.scheduleText
      @nextOccurrence = out.nextOccurrence
      @prevOccurrence = out.prevOccurrence      
    next()    

EventTagSchema = new Schema
  text:
    type: String
    required: true
    trim: true
  slug:
    type: String
    required: true
    trim: true
    uppercase: true

FeedSchema = new mongoose.Schema
  feedType :
    type : String
    enum: ['BUSINESS', 'EVENT']
    default : 'EVENT'
  geo: {
    'type':
      type: String,
      required: true,
      enum: ['Point', 'LineString', 'Polygon'],
      default: 'Point'
    coordinates: [Number]
  } 
  radius : Number
  tags : [String]
  user: ObjectId

MediaSchema= new Schema
    url:
      type:String
      required:false
    legacyUrl: String
    user: {type : ObjectId, ref : 'user'}  

PasswordResetSchema = new Schema
  requestDate : Date
  completedDate : Date
  token : String
  email : String

PostalCodeSchema = new Schema
  code:
    type: String
  city: 
    type: String
  state:
    type: String
  geo: {
    'type':
      type: String,
      required: true,
      enum: ['Point', 'LineString', 'Polygon'],
      default: 'Point'
    coordinates: [Number]
  }  

PromotionRequestSchema = new mongoose.Schema
  pushType : String
  title : String
  message: String
  startTime : Date
  location : String
  pageId: String
  pageAccessToken:String
  ticket_uri: String
  link: String
  caption:String
  promotionTime: Date
  promotionTarget : {type: ObjectId, ref:'promotionTarget'}
  media:[{type : ObjectId, ref : 'media'}]
  status : {
    postId:String
    code :
      type: String
      default: 'WAITING'
      enum: ['WAITING', 'COMPLETE', 'FAILED']
    retryCount:
      type: Number
      default: 0
    lastError: mongoose.Schema.Types.Mixed
    completedDate: Date
  }  

PromotionTargetSchema = new mongoose.Schema
  accountType :
    type : String
    enum: ['TWITTER', 'FACEBOOK']
  accessToken: String
  accessTokenSecret: String
  profileImageUrl: String
  profileName: String
  profileCoverPhoto:String
  profileId: String
  expiration: Date  

UserSchema = new Schema
  userType:
    type: String
    enum: ['BUSINESS','PUBLISHER']
  email:
    type: String
    required: true
    lowercase: true
    trim: true
    match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
  firstName: String
  lastName: String
  address1: String
  address2: String
  city: String
  state: String
  postalCode: String
  phone: String
  password:
    type: String
  encryptionMethod:
    type: String
    enum: ['SHA1','BCRYPT']
  businessPrivileges: [
    business: {type:ObjectId, ref:'business'}
    role: 
      type: String
      enum: ['OWNER','COLLABORATOR', 'ADMIN_COLLABORATOR']
  ]
  applications : [
    {
      name : String
      legacyKey : String
      apiKey : String
      apiSecret : String
      privileges: 
        type: String
        enum: ['PRIVILEGED', 'STANDARD']
    }
  ]
  authTokens : [{apiKey:String, authToken:String}]
  legacyId:String
  legacyProfiles:[String] 

WidgetSchema = new Schema
  widgetType: {
    type:String
    enum:["event-by-location","event-by-business"]
    required:true
    default:'event-by-location'
  }
  name: String
  filters: Boolean
  limit:Number
  location: {
    address: {type: String}
    neighborhood : String
    geo: {
      'type':
        type: String,
        enum: ['Point', 'LineString', 'Polygon'],
        default: 'Point'
      coordinates: [Number]
    }    
  }
  businesses: [{type:ObjectId, ref:'business'}]
  radius : Number
  tags : [String]
  user: {type:ObjectId, ref:'user'}
  height: Number
  width: Number
  widgetStyle: {
    type:String
    enum: ['dark','light']
  }
  accentColor: String    

module.exports.ApiUsage = mongoose.model('apiUsage', ApiUsageSchema, 'apiUsage')
module.exports.Business = mongoose.model('business', BusinessSchema,'business')
module.exports.BusinessTag = mongoose.model("businessTag", BusinessTagSchema, 'businessTag')  
module.exports.CollaboratorRequest= mongoose.model('collaboratorRequest',CollaboratorRequestSchema, 'collaboratorRequest')
module.exports.Event = mongoose.model('event', EventSchema, 'event')
module.exports.EventTag = mongoose.model("eventTag", EventTagSchema, 'eventTag')
module.exports.Feed = mongoose.model('feed', FeedSchema, 'feed')
module.exports.Media= mongoose.model('media',MediaSchema, 'media')
module.exports.PasswordReset= mongoose.model('passwordReset',PasswordResetSchema, 'passwordReset')
module.exports.PostalCode = mongoose.model('postalCode', PostalCodeSchema, 'postalCode')  
module.exports.PromotionRequest = mongoose.model('promotionRequest', PromotionRequestSchema, 'promotionRequest')
module.exports.PromotionTarget = mongoose.model('promotionTarget', PromotionTargetSchema, 'promotionTarget')
module.exports.SocialMediaLink= mongoose.model('socialMediaLink', SocialMediaLinkSchema)
module.exports.User = mongoose.model('user', UserSchema, 'user')
module.exports.Widget = mongoose.model('widget', WidgetSchema, 'widget')
module.exports.AggregationJob = mongoose.model('aggregationJob', AggregationJobSchema, 'aggregationJob')
