/**
 * # GBFS System Information Schema V1.1 OR GBFS System Information Schema V1.0
 * Details including system operator, system location, year implemented, URL, contact info, and time zone.
 *
 * ## Links
 * - [GBFS Specification V1.1](https://github.com/MobilityData/gbfs/blob/v1.1/gbfs.md#system_informationjson)
 * - [GBFS Specification V1.0](https://github.com/MobilityData/gbfs/blob/v1.0/gbfs.md#system_informationjson)
 */
export type GBFSSystemInformationV1 = GBFSSystemInformationV11 | GBFSSystemInformationV10;

/**
 * # GBFS System Information Schema V1.1
 * Details including system operator, system location, year implemented, URL, contact info, and time zone.
 *
 * ## Links
 * - [GBFS Specification V1.1](https://github.com/MobilityData/gbfs/blob/v1.1/gbfs.md#system_informationjson)
 */
export const gbfsSystemInformationSchemaV11 = {
  $schema: 'http://json-schema.org/draft-07/schema',
  $id: 'https://github.com/MobilityData/gbfs/blob/v1.1/gbfs.md#system_informationjson',
  description:
    'Details including system operator, system location, year implemented, URL, contact info, and time zone.',
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
      const: '1.1',
    },
    data: {
      description: 'Response data in the form of name:value pairs.',
      type: 'object',
      properties: {
        system_id: {
          description:
            'Identifier for this vehicle share system. This should be globally unique (even between different systems).',
          type: 'string',
        },
        language: {
          description:
            'The language that will be used throughout the rest of the files. It must match the value in the gbfs.json file.',
          type: 'string',
          pattern: '^[a-z]{2,3}(-[A-Z]{2})?$',
        },
        name: {
          description: 'Name of the system to be displayed to customers.',
          type: 'string',
        },
        short_name: {
          description: 'Optional abbreviation for a system.',
          type: 'string',
        },
        operator: {
          description: 'Name of the operator.',
          type: 'string',
        },
        url: {
          description: 'The URL of the vehicle share system.',
          type: 'string',
          format: 'uri',
        },
        purchase_url: {
          description: 'URL where a customer can purchase a membership.',
          type: 'string',
          format: 'uri',
        },
        start_date: {
          description: 'Date that the system began operations.',
          type: 'string',
          format: 'date',
        },
        phone_number: {
          description:
            "A single voice telephone number for the specified system that presents the telephone number as typical for the system's service area.",
          type: 'string',
        },
        email: {
          description:
            "Email address actively monitored by the operator's customer service department.",
          type: 'string',
          format: 'email',
        },
        feed_contact_email: {
          description:
            'A single contact email address for consumers of this feed to report technical issues (added in v1.1).',
          type: 'string',
          format: 'email',
        },
        timezone: {
          description: 'The time zone where the system is located.',
          type: 'string',
        },
        license_url: {
          description:
            'A fully qualified URL of a page that defines the license terms for the GBFS data for this system.',
          type: 'string',
          format: 'uri',
        },
        rental_apps: {
          description:
            'Contains rental app information in the android and ios JSON objects (added in v1.1).',
          type: 'object',
          properties: {
            android: {
              description:
                'Contains rental app download and app discovery information for the Android platform. (added in v1.1)',
              type: 'object',
              properties: {
                store_uri: {
                  description:
                    'URI where the rental Android app can be downloaded from (added in v1.1).',
                  type: 'string',
                  format: 'uri',
                },
                discovery_uri: {
                  description:
                    'URI that can be used to discover if the rental Android app is installed on the device (added in v1.1).',
                  type: 'string',
                  format: 'uri',
                },
              },
              required: ['store_uri', 'discovery_uri'],
            },
            ios: {
              description: 'Contains rental information for the iOS platform (added in v1.1).',
              type: 'object',
              properties: {
                store_uri: {
                  description:
                    'URI where the rental iOS app can be downloaded from (added in v1.1).',
                  type: 'string',
                  format: 'uri',
                },
                discovery_uri: {
                  description:
                    'URI that can be used to discover if the rental iOS app is installed on the device (added in v1.1).',
                  type: 'string',
                  format: 'uri',
                },
              },
              required: ['store_uri', 'discovery_uri'],
            },
          },
        },
      },
      required: ['system_id', 'language', 'name', 'timezone'],
    },
  },
  required: ['last_updated', 'ttl', 'version', 'data'],
};

/**
 * GBFS System Information Schema V1.1 Interface
 */
export interface GBFSSystemInformationV11 {
  /** Last time the data in the feed was updated in POSIX time. */
  last_updated: number;

  /** Number of seconds before the data in the feed will be updated again. */
  ttl: number;

  /** GBFS version number (1.1). */
  version: '1.1';

  /** Data containing system information. */
  data: {
    system_id: string;
    language: string;
    name: string;
    short_name?: string;
    operator?: string;
    url?: string;
    purchase_url?: string;
    start_date?: string;
    phone_number?: string;
    email?: string;
    feed_contact_email?: string;
    timezone: string;
    license_url?: string;
    rental_apps?: {
      android?: {
        store_uri: string;
        discovery_uri: string;
      };
      ios?: {
        store_uri: string;
        discovery_uri: string;
      };
    };
  };
}

/**
 * # GBFS System Information Schema V1.0
 * Details including system operator, system location, year implemented, URL, contact info, and time zone.
 *
 * ## Links
 * - [GBFS Specification V1.0](https://github.com/MobilityData/gbfs/blob/v1.0/gbfs.md#system_informationjson)
 */
export const gbfsSystemInformationSchemaV10 = {
  $schema: 'http://json-schema.org/draft-07/schema',
  $id: 'https://github.com/MobilityData/gbfs/blob/v1.0/gbfs.md#system_informationjson',
  description:
    'Details including system operator, system location, year implemented, URL, contact info, and time zone.',
  type: 'object',
  properties: {
    last_updated: {
      description: 'Last time the data in the feed was updated in POSIX time.',
      type: 'integer',
      minimum: 0,
      maximum: 1924988399,
    },
    ttl: {
      description:
        'Number of seconds before the data in the feed will be updated again (0 if the data should always be refreshed).',
      type: 'integer',
      minimum: 0,
    },
    data: {
      description: 'Response data in the form of name:value pairs.',
      type: 'object',
      properties: {
        system_id: {
          description:
            'Identifier for this vehicle share system. This should be globally unique (even between different systems).',
          type: 'string',
        },
        language: {
          description:
            'The language that will be used throughout the rest of the files. It must match the value in the gbfs.json file.',
          type: 'string',
          pattern: '^[a-z]{2}$',
        },
        name: {
          description: 'Name of the system to be displayed to customers.',
          type: 'string',
        },
        short_name: {
          description: 'Optional abbreviation for a system.',
          type: 'string',
        },
        operator: {
          description: 'Name of the operator.',
          type: 'string',
        },
        url: {
          description: 'The URL of the vehicle share system.',
          type: 'string',
        },
        purchase_url: {
          description: 'URL where a customer can purchase a membership.',
          type: 'string',
        },
        start_date: {
          description: 'Date that the system began operations.',
          type: 'string',
          format: 'date',
        },
        phone_number: {
          description:
            "A single voice telephone number for the specified system that presents the telephone number as typical for the system's service area.",
          type: 'string',
        },
        email: {
          description:
            "Email address actively monitored by the operator's customer service department.",
          type: 'string',
        },
        timezone: {
          description: 'The time zone where the system is located.',
          type: 'string',
        },
        license_url: {
          description:
            'A fully qualified URL of a page that defines the license terms for the GBFS data for this system.',
          type: 'string',
        },
      },
      required: ['system_id', 'language', 'name', 'timezone'],
    },
  },
  required: ['last_updated', 'ttl', 'data'],
};

/**
 * GBFS System Information Schema V1.0 Interface
 */
export interface GBFSSystemInformationV10 {
  /** Last time the data in the feed was updated in POSIX time. */
  last_updated: number;

  /** Number of seconds before the data in the feed will be updated again. */
  ttl: number;

  /** Data containing system information. */
  data: {
    system_id: string;
    language: string;
    name: string;
    short_name?: string;
    operator?: string;
    url?: string;
    purchase_url?: string;
    start_date?: string;
    phone_number?: string;
    email?: string;
    timezone: string;
    license_url?: string;
  };
}
