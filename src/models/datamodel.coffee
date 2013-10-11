mongoose = require('mongoose')
Schema = mongoose.Schema
ObjectId = mongoose.Schema.ObjectId
Mixed = mongoose.Schema.Mixed

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
    required: true
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
      'type':
        type:String
        required:true
      sourceId: 
        type:Number
        required:true
      data:Mixed
      lastUpdated: 
        type:Date
        required:true
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
    required: true
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
      'type':
        type:String
        required:true
      sourceId: 
        type:Number
        required:true
      data: Mixed
      lastUpdated: 
        type:Date
        required:true
    }
  ]    
  occurrences:[OccurrenceSchema]
  nextOccurrence: {start: Date, end:Date}
  prevOccurrence: {start: Date, end:Date}
  scheduleText: String
  legacySchedule: {
    "dayNum": Number
    "period": Number
    "periodDay": [Number]
    "ordinal": Number
    "recurrenceInterval": Number
    "dayofweek": Number
    days: String
    start: Date
    end: Date
    hour: Number
    minute:Number
    duration:Number
  }
  legacyId: String
  legacyBusinessId: String  
  legacyHostId : String 
  legacyImage: String
  tzOffset : Number  

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

module.exports = 
  ApiUsage : mongoose.model('apiUsage', ApiUsageSchema, 'apiUsage')
  Business : mongoose.model('business', BusinessSchema,'business')
  BusinessSchema: BusinessSchema
  BusinessTag : mongoose.model("businessTag", BusinessTagSchema, 'businessTag')  
  CollaboratorRequest: mongoose.model('collaboratorRequest',CollaboratorRequestSchema, 'collaboratorRequest')
  CollaboratorRequestSchema : CollaboratorRequestSchema  
  Event : mongoose.model('event', EventSchema, 'event')
  EventSchema : EventSchema  
  EventTag : mongoose.model("eventTag", EventTagSchema, 'eventTag')
  Feed : mongoose.model('feed', FeedSchema, 'feed')
  FeedSchema : FeedSchema  
  Media: mongoose.model('media',MediaSchema, 'media')
  MediaSchema : MediaSchema  
  PasswordReset: mongoose.model('passwordReset',PasswordResetSchema, 'passwordReset')
  PasswordResetSchema : PasswordResetSchema  
  PostalCode : mongoose.model('postalCode', PostalCodeSchema, 'postalCode')  
  PromotionRequest : mongoose.model('promotionRequest', PromotionRequestSchema, 'promotionRequest')
  PromotionRequestSchema : PromotionRequestSchema  
  PromotionTarget : mongoose.model('promotionTarget', PromotionTargetSchema, 'promotionTarget')
  PromotionTargetSchema : PromotionTargetSchema  
  SocialMediaLink: mongoose.model('socialMediaLink', SocialMediaLinkSchema)
  SocialMediaLinkSchema : SocialMediaLinkSchema  
  User : mongoose.model('user', UserSchema, 'user')
  Widget : mongoose.model('widget', WidgetSchema, 'widget')
  WidgetSchema: WidgetSchema  