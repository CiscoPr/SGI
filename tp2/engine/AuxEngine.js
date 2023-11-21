import * as THREE from 'three';

/**
 * This class contains some auxiliary methods used in the main engine
 */
class AuxEngine {

    /**
    * Constructs the object
    */
    constructor() {
    }

    /**
     * Applies the transformations to a given group
     * @param {THREE.Group} group
     * @param {Array} transformations
     */
    applyTransformations(group, transformations) {
        for (let i = transformations.length - 1; i >= 0; i--) {
            const transformation = transformations[i];
            let currentMatrix = new THREE.Matrix4();
            switch (transformation.type) {
                case "T":
                    const translation = transformation.translate;
                    const translationVector = new THREE.Vector3(translation[0], translation[1], translation[2]);

                    group.applyMatrix4(new THREE.Matrix4().makeTranslation(translationVector));
                    break;
                case "R":
                    const rotation = transformation.rotation;
                    const euler = new THREE.Euler(rotation[0] * Math.PI / 180, rotation[1] * Math.PI / 180, rotation[2] * Math.PI / 180, "XYZ");

                    group.applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(euler));
                    break;
                case "S":
                    const scale = transformation.scale;

                    group.applyMatrix4(new THREE.Matrix4().makeScale(scale[0], scale[1], scale[2]));
                    break;
                default:
                    console.error("Transformation type not found");
                    break;
            }
        }
    }

    /**
     * Maps the min filter from string to THREE constant
     * @param {String} str
     */
    mapMinFilter(str) {
        switch (str) {
            case "NearestFilter":
                return THREE.NearestFilter;
            case "NearestMipmapNearestFilter":
                return THREE.NearestMipmapNearestFilter;
            case "NearestMipmapLinearFilter":
                return THREE.NearestMipmapLinearFilter;
            case "LinearFilter":
                return THREE.LinearFilter;
            case "LinearMipmapNearestFilter":
                return THREE.LinearMipmapNearestFilter;
            default:
            return THREE.LinearMipmapLinearFilter;
        }
    }

    /**
     * Maps the mag filter from string to THREE constant
     * @param {String} str
     * @returns
     */
    mapMagFilter(str) {
        if (str == "NearestFilter") return THREE.NearestFilter;
        else return THREE.LinearFilter;
    }


    /**
     * load an image and create a mipmap to be added to a texture at the defined level.
     * In between, add the image some text and control squares. These items become part of the picture
     *
     * @param {*} parentTexture the texture to which the mipmap is added
     * @param {*} level the level of the mipmap
     * @param {*} path the path for the mipmap image
     */
    loadMipmap(parentTexture, level, path)
    {
        // load texture. On loaded call the function to create the mipmap for the specified level
        new THREE.TextureLoader().load(path,
            function(mipmapTexture)  // onLoad callback
            {
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                ctx.scale(1, 1);

                const img = mipmapTexture.image
                canvas.width = img.width;
                canvas.height = img.height

                // first draw the image
                ctx.drawImage(img, 0, 0 )

                // set the mipmap image in the parent texture in the appropriate level
                parentTexture.mipmaps[level] = canvas
            },
            undefined, // onProgress callback currently not supported
            function(err) {
                console.error('Unable to load the image ' + path + ' as mipmap level ' + level + ".", err)
            }
        )
    }



    calVertexColor(p1x, p1y, p1z, p2x, p2y, p2z, p3x, p3y, p3z, radius, color_p, color_c) {
        const colors = [];

        // origin
        const origin = new THREE.Vector3(0, 0, 0)
        const tValues = []; 

        // generate 3d vectors for each point
        const p1 = new THREE.Vector3(p1x, p1y, p1z);
        const p2 = new THREE.Vector3(p2x, p2y, p2z);
        const p3 = new THREE.Vector3(p3x, p3y, p3z);

        // calculate t value
        tValues.push(origin.distanceTo(p1) / radius);
        tValues.push(origin.distanceTo(p2) / radius);
        tValues.push(origin.distanceTo(p3) / radius);

        // for cycle
        for (let i = 0; i < 3; i++) {
            let r = color_c.r + (color_p.r - color_c.r) * tValues[i];
            let g = color_c.g + (color_p.g - color_c.g) * tValues[i];
            let b = color_c.b + (color_p.b - color_c.b) * tValues[i];
            let a = color_c.a + (color_p.a - color_c.a) * tValues[i];
            
            colors.push(r, g, b, a);
        }


        return colors;
    }


}
export { AuxEngine };