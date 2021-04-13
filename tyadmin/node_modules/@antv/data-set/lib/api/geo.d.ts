import { ExtendedFeature } from 'd3-geo';
import { View } from '../view';
declare const api: {
    geoArea(feature: ExtendedFeature<import("d3-geo").GeoGeometryObjects, {
        [name: string]: any;
    }>): number;
    geoAreaByName(this: View, name: string): number;
    geoCentroid(feature: ExtendedFeature<import("d3-geo").GeoGeometryObjects, {
        [name: string]: any;
    }>): [number, number];
    geoCentroidByName(this: View, name: string): [number, number];
    geoDistance(p1: any, p2: any): number;
    geoLength(feature: ExtendedFeature<import("d3-geo").GeoGeometryObjects, {
        [name: string]: any;
    }>): number;
    geoLengthByName(this: View, name: string): number;
    geoContains(feature: ExtendedFeature<import("d3-geo").GeoGeometryObjects, {
        [name: string]: any;
    }>, position: [number, number]): boolean;
    geoFeatureByName(this: View, name: string): any;
    geoFeatureByPosition(this: View, position: [number, number]): any;
    geoNameByPosition(this: View, position: [number, number]): any;
    getGeoProjection: (projection: string, exportRaw?: boolean) => any;
    geoProject(feature: ExtendedFeature<import("d3-geo").GeoGeometryObjects, {
        [name: string]: any;
    }>, projection: string, exportRaw?: boolean): any;
    geoProjectByName(this: View, name: string, projection: string, exportRaw?: boolean): any;
    geoProjectPosition(position: [number, number], projection: string, exportRaw?: boolean): any;
    geoProjectInvert(position: [number, number], projection: string, exportRaw?: boolean): any;
};
export declare type GeoApi = typeof api;
export {};
