/**
 * # GBFS Alerts V2
 * Describes ad-hoc changes to the system.
 *
 * ## Links
 * - [GBFS Specification](https://github.com/MobilityData/gbfs/blob/v2.3/gbfs.md#system_alertsjson)
 */
export const gbfsSystemAlertsSchemaV2 = {
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
