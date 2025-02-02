/**
 * # GBFS Alerts Schema V2.3, V2.2, V2.1, OR V2.0
 * Describes ad-hoc changes to the system.
 *
 * ## Links
 * - [GBFS Specification V2.3](https://github.com/MobilityData/gbfs/blob/v2.3/gbfs.md#system_alertsjson)
 * - [GBFS Specification V2.2](https://github.com/MobilityData/gbfs/blob/v2.2/gbfs.md#system_alertsjson)
 * - [GBFS Specification V2.1](https://github.com/MobilityData/gbfs/blob/v2.1/gbfs.md#system_alertsjson)
 * - [GBFS Specification V2.0](https://github.com/MobilityData/gbfs/blob/v2.0/gbfs.md#system_alertsjson)
 */
export type GBFSSystemAlertsV2 =
  | GBFSSystemAlertsV23
  | GBFSSystemAlertsV22
  | GBFSSystemAlertsV21
  | GBFSSystemAlertsV20;

/**
 * # GBFS System Alerts Schema V2.3
 * Describes ad-hoc changes to the system.
 *
 * ## Links
 * - [GBFS Specification](https://github.com/MobilityData/gbfs/blob/v2.3/gbfs.md#system_alertsjson)
 */
export const gbfsSystemAlertsSchemaV23 = {
  $schema: 'http://json-schema.org/draft-07/schema',
  $id: 'https://github.com/MobilityData/gbfs/blob/v2.3/gbfs.md#system_alertsjson',
  description: 'Describes ad-hoc changes to the system.',
  type: 'object',
  properties: {
    last_updated: {
      description: 'Last time the data in the feed was updated in POSIX time.',
      type: 'integer',
      minimum: 1450155600,
    },
    ttl: {
      description:
        'Number of seconds before the data in the feed will be updated again (0 if the data should always be refreshed).',
      type: 'integer',
      minimum: 0,
    },
    version: {
      description:
        'GBFS version number to which the feed conforms, according to the versioning framework (added in v1.1).',
      type: 'string',
      const: '2.3',
    },
    data: {
      description: 'Array that contains ad-hoc alerts for the system.',
      type: 'object',
      properties: {
        alerts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              alert_id: {
                description: 'Identifier for this alert.',
                type: 'string',
              },
              type: {
                description: 'Type of alert.',
                type: 'string',
                enum: ['system_closure', 'station_closure', 'station_move', 'other'],
              },
              times: {
                description: 'Array of objects indicating when the alert is in effect.',
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    start: {
                      description: 'Start time of the alert.',
                      type: 'integer',
                      minimum: 1450155600,
                    },
                    end: {
                      description: 'End time of the alert.',
                      type: 'integer',
                      minimum: 1450155600,
                    },
                  },
                },
                additionalItems: false,
                required: ['start'],
              },
              station_ids: {
                description: 'Array of identifiers of the stations for which this alert applies.',
                type: 'array',
                items: {
                  type: 'string',
                },
              },
              region_ids: {
                description: 'Array of identifiers of the regions for which this alert applies.',
                type: 'array',
                items: {
                  type: 'string',
                },
              },
              url: {
                description: 'URL where the customer can learn more information about this alert.',
                type: 'string',
                format: 'uri',
              },
              summary: {
                description: 'A short summary of this alert to be displayed to the customer.',
                type: 'string',
              },
              description: {
                description: 'Detailed description of the alert.',
                type: 'string',
              },
              last_updated: {
                description: 'Indicates the last time the info for the alert was updated.',
                type: 'number',
                minimum: 1450155600,
              },
            },
            required: ['alert_id', 'type', 'summary'],
          },
        },
      },
      required: ['alerts'],
    },
  },
  required: ['last_updated', 'ttl', 'version', 'data'],
};

/**
 * # GBFS System Alerts V2.3
 * Describes ad-hoc changes to the system.
 *
 * ## Links
 * - [GBFS Specification](https://github.com/MobilityData/gbfs/blob/v2.3/gbfs.md#system_alertsjson)
 */
export interface GBFSSystemAlertsV23 {
  /**
   * Last time the data in the feed was updated in POSIX time.
   * **Minimum**: 1450155600
   */
  last_updated: number;

  /**
   * Number of seconds before the data in the feed will be updated again (0 if the data should always be refreshed).
   * **Minimum**: 0
   */
  ttl: number;

  /**
   * GBFS version number to which the feed conforms, according to the versioning framework.
   * **Const**: 2.3
   */
  version: '2.3';

  /**
   * Contains system alerts data.
   */
  data: {
    /**
     * Array of alerts for the system.
     */
    alerts: Array<{
      alert_id: string;
      type: 'system_closure' | 'station_closure' | 'station_move' | 'other';
      times?: Array<{
        start: number;
        end?: number;
      }>;
      station_ids?: string[];
      region_ids?: string[];
      url?: string;
      summary: string;
      description?: string;
      last_updated?: number;
    }>;
  };
}

/**
 * # GBFS System Alerts Schema V2.2
 * Describes ad-hoc changes to the system.
 *
 * ## Links
 * - [GBFS Specification](https://github.com/MobilityData/gbfs/blob/v2.2/gbfs.md#system_alertsjson)
 */
export const gbfsSystemAlertsSchemaV22 = {
  $schema: 'http://json-schema.org/draft-07/schema',
  $id: 'https://github.com/MobilityData/gbfs/blob/v2.2/gbfs.md#system_alertsjson',
  description: 'Describes ad-hoc changes to the system.',
  type: 'object',
  properties: {
    last_updated: {
      description: 'Last time the data in the feed was updated in POSIX time.',
      type: 'integer',
      minimum: 1450155600,
    },
    ttl: {
      description:
        'Number of seconds before the data in the feed will be updated again (0 if the data should always be refreshed).',
      type: 'integer',
      minimum: 0,
    },
    version: {
      description:
        'GBFS version number to which the feed conforms, according to the versioning framework (added in v1.1).',
      type: 'string',
      const: '2.2',
    },
    data: {
      description: 'Array that contains ad-hoc alerts for the system.',
      type: 'object',
      properties: {
        alerts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              alert_id: {
                description: 'Identifier for this alert.',
                type: 'string',
              },
              type: {
                description: 'Type of alert.',
                type: 'string',
                enum: ['system_closure', 'station_closure', 'station_move', 'other'],
              },
              times: {
                description: 'Array of objects indicating when the alert is in effect.',
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    start: {
                      description: 'Start time of the alert.',
                      type: 'number',
                      minimum: 1450155600,
                    },
                    end: {
                      description: 'End time of the alert.',
                      type: 'number',
                      minimum: 1450155600,
                    },
                  },
                },
                additionalItems: false,
                required: ['start'],
              },
              station_ids: {
                description: 'Array of identifiers of the stations for which this alert applies.',
                type: 'array',
                items: { type: 'string' },
              },
              region_ids: {
                description: 'Array of identifiers of the regions for which this alert applies.',
                type: 'array',
                items: { type: 'string' },
              },
              url: {
                description: 'URL where the customer can learn more information about this alert.',
                type: 'string',
                format: 'uri',
              },
              summary: {
                description: 'A short summary of this alert to be displayed to the customer.',
                type: 'string',
              },
              description: {
                description: 'Detailed description of the alert.',
                type: 'string',
              },
              last_updated: {
                description: 'Indicates the last time the info for the alert was updated.',
                type: 'number',
                minimum: 1450155600,
              },
            },
            required: ['alert_id', 'type', 'summary'],
          },
        },
      },
      required: ['alerts'],
    },
  },
  required: ['last_updated', 'ttl', 'version', 'data'],
};

/**
 * # GBFS System Alerts V2.2
 * Describes ad-hoc changes to the system.
 *
 * ## Links
 * - [GBFS Specification](https://github.com/MobilityData/gbfs/blob/v2.2/gbfs.md#system_alertsjson)
 */
export interface GBFSSystemAlertsV22 {
  /**
   * Last time the data in the feed was updated in POSIX time.
   * **Minimum**: 1450155600
   */
  last_updated: number;

  /**
   * Number of seconds before the data in the feed will be updated again (0 if the data should always be refreshed).
   * **Minimum**: 0
   */
  ttl: number;

  /**
   * GBFS version number to which the feed conforms, according to the versioning framework.
   * **Const**: 2.2
   */
  version: '2.2';

  /**
   * Contains system alerts data.
   */
  data: {
    /**
     * Array of alerts for the system.
     */
    alerts: Array<{
      alert_id: string;
      type: 'system_closure' | 'station_closure' | 'station_move' | 'other';
      times?: Array<{
        start: number;
        end?: number;
      }>;
      station_ids?: string[];
      region_ids?: string[];
      url?: string;
      summary: string;
      description?: string;
      last_updated?: number;
    }>;
  };
}

/**
 * # GBFS System Alerts Schema V2.1
 * Describes ad-hoc changes to the system.
 *
 * ## Links
 * - [GBFS Specification](https://github.com/MobilityData/gbfs/blob/v2.1/gbfs.md#system_alertsjson)
 */
export const gbfsSystemAlertsSchemaV21 = {
  $schema: 'http://json-schema.org/draft-07/schema',
  $id: 'https://github.com/MobilityData/gbfs/blob/v2.1/gbfs.md#system_alertsjson',
  description: 'Describes ad-hoc changes to the system.',
  type: 'object',
  properties: {
    last_updated: {
      description: 'Last time the data in the feed was updated in POSIX time.',
      type: 'integer',
      minimum: 1450155600,
    },
    ttl: {
      description:
        'Number of seconds before the data in the feed will be updated again (0 if the data should always be refreshed).',
      type: 'integer',
      minimum: 0,
    },
    version: {
      description:
        'GBFS version number to which the feed conforms, according to the versioning framework (added in v1.1).',
      type: 'string',
      const: '2.1',
    },
    data: {
      description: 'Array that contains ad-hoc alerts for the system.',
      type: 'object',
      properties: {
        alerts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              alert_id: {
                description: 'Identifier for this alert.',
                type: 'string',
              },
              type: {
                description: 'Type of alert.',
                type: 'string',
                enum: ['system_closure', 'station_closure', 'station_move', 'other'],
              },
              times: {
                description: 'Array of objects indicating when the alert is in effect.',
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    start: {
                      description: 'Start time of the alert.',
                      type: 'number',
                      minimum: 1450155600,
                    },
                    end: {
                      description: 'End time of the alert.',
                      type: 'number',
                      minimum: 1450155600,
                    },
                  },
                },
                additionalItems: false,
                required: ['start'],
              },
              station_ids: {
                description: 'Array of identifiers of the stations for which this alert applies.',
                type: 'array',
                items: { type: 'string' },
              },
              region_ids: {
                description: 'Array of identifiers of the regions for which this alert applies.',
                type: 'array',
                items: { type: 'string' },
              },
              url: {
                description: 'URL where the customer can learn more information about this alert.',
                type: 'string',
                format: 'uri',
              },
              summary: {
                description: 'A short summary of this alert to be displayed to the customer.',
                type: 'string',
              },
              description: {
                description: 'Detailed description of the alert.',
                type: 'string',
              },
              last_updated: {
                description: 'Indicates the last time the info for the alert was updated.',
                type: 'number',
                minimum: 1450155600,
              },
            },
            required: ['alert_id', 'type', 'summary'],
          },
        },
      },
      required: ['alerts'],
    },
  },
  required: ['last_updated', 'ttl', 'version', 'data'],
};

/**
 * # GBFS System Alerts V2.1
 * Describes ad-hoc changes to the system.
 *
 * ## Links
 * - [GBFS Specification](https://github.com/MobilityData/gbfs/blob/v2.1/gbfs.md#system_alertsjson)
 */
export interface GBFSSystemAlertsV21 {
  /**
   * Last time the data in the feed was updated in POSIX time.
   * **Minimum**: 1450155600
   */
  last_updated: number;

  /**
   * Number of seconds before the data in the feed will be updated again (0 if the data should always be refreshed).
   * **Minimum**: 0
   */
  ttl: number;

  /**
   * GBFS version number to which the feed conforms, according to the versioning framework.
   * **Const**: 2.1
   */
  version: '2.1';

  /**
   * Contains system alerts data.
   */
  data: {
    /**
     * Array of alerts for the system.
     */
    alerts: Array<{
      alert_id: string;
      type: 'system_closure' | 'station_closure' | 'station_move' | 'other';
      times?: Array<{
        start: number;
        end?: number;
      }>;
      station_ids?: string[];
      region_ids?: string[];
      url?: string;
      summary: string;
      description?: string;
      last_updated?: number;
    }>;
  };
}

/**
 * # GBFS System Alerts Schema V2.0
 * Describes ad-hoc changes to the system.
 *
 * ## Links
 * - [GBFS Specification](https://github.com/MobilityData/gbfs/blob/v2.0/gbfs.md#system_alertsjson)
 */
export const gbfsSystemAlertsSchemaV20 = {
  $schema: 'http://json-schema.org/draft-07/schema',
  $id: 'https://github.com/MobilityData/gbfs/blob/v2.0/gbfs.md#system_alertsjson',
  description: 'Describes ad-hoc changes to the system.',
  type: 'object',
  properties: {
    last_updated: {
      description: 'Last time the data in the feed was updated in POSIX time.',
      type: 'integer',
      minimum: 1450155600,
    },
    ttl: {
      description:
        'Number of seconds before the data in the feed will be updated again (0 if the data should always be refreshed).',
      type: 'integer',
      minimum: 0,
    },
    version: {
      description:
        'GBFS version number to which the feed conforms, according to the versioning framework (added in v1.1).',
      type: 'string',
      const: '2.0',
    },
    data: {
      description: 'Array that contains ad-hoc alerts for the system.',
      type: 'object',
      properties: {
        alerts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              alert_id: {
                description: 'Identifier for this alert.',
                type: 'string',
              },
              type: {
                description: 'Type of alert.',
                type: 'string',
                enum: ['SYSTEM_CLOSURE', 'STATION_CLOSURE', 'STATION_MOVE', 'OTHER'],
              },
              times: {
                description: 'Array of objects indicating when the alert is in effect.',
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    start: {
                      description: 'Start time of the alert.',
                      type: 'number',
                      minimum: 1450155600,
                    },
                    end: {
                      description: 'End time of the alert.',
                      type: 'number',
                      minimum: 1450155600,
                    },
                  },
                },
                additionalItems: false,
                required: ['start'],
              },
              station_ids: {
                description: 'Array of identifiers of the stations for which this alert applies.',
                type: 'array',
                items: { type: 'string' },
              },
              region_ids: {
                description: 'Array of identifiers of the regions for which this alert applies.',
                type: 'array',
                items: { type: 'string' },
              },
              url: {
                description: 'URL where the customer can learn more information about this alert.',
                type: 'string',
                format: 'uri',
              },
              summary: {
                description: 'A short summary of this alert to be displayed to the customer.',
                type: 'string',
              },
              description: {
                description: 'Detailed description of the alert.',
                type: 'string',
              },
              last_updated: {
                description: 'Indicates the last time the info for the alert was updated.',
                type: 'number',
                minimum: 1450155600,
              },
            },
            required: ['alert_id', 'type', 'summary'],
          },
        },
      },
      required: ['alerts'],
    },
  },
  required: ['last_updated', 'ttl', 'version', 'data'],
};

/**
 * # GBFS System Alerts V2.0
 * Describes ad-hoc changes to the system.
 *
 * ## Links
 * - [GBFS Specification](https://github.com/MobilityData/gbfs/blob/v2.0/gbfs.md#system_alertsjson)
 */
export interface GBFSSystemAlertsV20 {
  /**
   * Last time the data in the feed was updated in POSIX time.
   * **Minimum**: 1450155600
   */
  last_updated: number;

  /**
   * Number of seconds before the data in the feed will be updated again (0 if the data should always be refreshed).
   * **Minimum**: 0
   */
  ttl: number;

  /**
   * GBFS version number to which the feed conforms, according to the versioning framework.
   * **Const**: 2.0
   */
  version: '2.0';

  /**
   * Contains system alerts data.
   */
  data: {
    /**
     * Array of alerts for the system.
     */
    alerts: Array<{
      alert_id: string;
      type: 'SYSTEM_CLOSURE' | 'STATION_CLOSURE' | 'STATION_MOVE' | 'OTHER';
      times?: Array<{
        start: number;
        end?: number;
      }>;
      station_ids?: string[];
      region_ids?: string[];
      url?: string;
      summary: string;
      description?: string;
      last_updated?: number;
    }>;
  };
}
