import * as THREE from 'three'

class MyFirework {

    constructor(launcher) {
        this.launcher = launcher

        this.done     = false 
        this.dest     = [] 
        
        this.vertices = null
        this.colors   = null
        this.geometry = null
        this.points   = null
        
        this.material = new THREE.PointsMaterial({
            size: 0.1,
            color: 0xffffff,
            opacity: 1,
            vertexColors: true,
            transparent: true,
            depthTest: false,
        })
        
        this.height = 300
        this.speed = 20

        this.launch() 

    }

    /**
     * compute particle launch
     */

    launch() {
        let color = new THREE.Color()
        color.setHSL( THREE.MathUtils.randFloat( 0.1, 0.9 ), 1, 0.9 )
        let colors = [ color.r, color.g, color.b ]

        let x = THREE.MathUtils.randFloat( -5, 5 ) 
        let y = THREE.MathUtils.randFloat( this.height * 0.9, this.height * 1.1)
        let z = THREE.MathUtils.randFloat( -5, 5 ) 
        this.dest.push( x, y, z ) 
        let vertices = [0,0,0]
        
        this.geometry = new THREE.BufferGeometry()
        this.geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(vertices), 3 ) );
        this.geometry.setAttribute( 'color', new THREE.BufferAttribute( new Float32Array(colors), 3 ) );
        this.points = new THREE.Points( this.geometry, this.material )
        this.points.castShadow = true;
        this.points.receiveShadow = true;
        this.launcher.add( this.points )  
        console.log("firework launched")
    }

    /**
     * compute explosion
     * @param {*} vector 
     */
    explode(origin, n, rangeBegin, rangeEnd) {
        // add n particles departing from the location at (origin[0], origin[1], origin[2])
        let color = new THREE.Color()
        color.setHSL( THREE.MathUtils.randFloat( 0.1, 0.9 ), 1, 0.9 )
        let rgb = [ color.r, color.g, color.b ]
        let vertices = [];
        let colors = [];
        for( let i = 0; i < n; i++ ) {
            vertices.push( origin[0], origin[1], origin[2] )
            colors.push( rgb[0], rgb[1], rgb[2] )
        }

        this.geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(vertices), 3 ) );
        this.geometry.setAttribute( 'color', new THREE.BufferAttribute( new Float32Array(colors), 3 ) );
        

        // compute destination for each particle
        let radius = THREE.MathUtils.randFloat( rangeBegin, rangeEnd )

        // compute destination for each particle
        this.dest = []
        for( let i = 0; i < vertices.length; i+=3 ) {
            let theta = THREE.MathUtils.randFloat( 0, 2 * Math.PI )
            let phi = THREE.MathUtils.randFloat( 0, 2 * Math.PI )
            let x = origin[0] + radius * Math.cos( theta ) * Math.sin( phi )
            let y = origin[1] + radius * Math.sin( theta ) * Math.sin( phi )
            let z = origin[2] + radius * Math.cos( phi )
            this.dest.push( x, y, z ) 
        }
    }
    
    /**
     * cleanup
     */
    reset() {
        console.log("firework reseted")
        this.launcher.remove( this.points )  
        this.dest     = [] 
        this.vertices = null
        this.colors   = null 
        this.geometry = null
        this.points   = null
    }

    /**
     * update firework
     * @returns 
     */
    update() {
        
        // do only if objects exist
        if( this.points && this.geometry )
        {
            let verticesAtribute = this.geometry.getAttribute( 'position' )
            let vertices = verticesAtribute.array
            let count = verticesAtribute.count

            console.log(count + " particles")
            // lerp particle positions 
            let j = 0
            for( let i = 0; i < vertices.length; i+=3 ) {
                vertices[i  ] += ( this.dest[i  ] - vertices[i  ] ) / this.speed
                vertices[i+1] += ( this.dest[i+1] - vertices[i+1] ) / this.speed
                vertices[i+2] += ( this.dest[i+2] - vertices[i+2] ) / this.speed
            }
            verticesAtribute.needsUpdate = true
            
            // only one particle?
            if( count === 1 ) {
                //is YY coordinate higher close to destination YY? 
                if( Math.ceil( vertices[1] ) > ( this.dest[1] * 0.95 ) ) {
                    // add n particles departing from the location at (vertices[0], vertices[1], vertices[2])
                    this.explode(vertices, 80, this.height * 0.05, this.height * 0.8) 
                    return 
                }
            }
            
            // are there a lot of particles (aka already exploded)?
            if( count > 1 ) {
                // fade out exploded particles 
                this.material.opacity -= 0.015 
                this.material.needsUpdate = true
            }
            
            // remove, reset and stop animating 
            if( this.material.opacity <= 0 )
            {
                this.reset() 
                this.done = true 
                return 
            }
        }
    }
}

class MyFireworks {
    
    constructor(scene) {
        this.launcher = new THREE.Group()
        this.fireworksGroup = new THREE.Group()
        this.scene = scene
        this.fireworks = []
        this.stop = false
    }

    init(x = 0, y = 0, z = 0) {
        this.stop = false
        this.launcher.add(this.fireworksGroup)
        
        // create  rectangle launcher
        let geometry = new THREE.BoxGeometry( 1, 4, 1 )
        let material = new THREE.MeshBasicMaterial( {color: 0x00ff00} )
        this.mesh = new THREE.Mesh( geometry, material )

        this.launcher.add( this.mesh )

        this.scene.add( this.launcher )
    }

    remove() {
        this.stop = true
        // for each fireworks
        for( let i = 0; i < this.fireworks.length; i++ ) {
            // remove firework 
            this.fireworks[i].reset()
            this.fireworksGroup.remove(this.fireworks[i])
            this.fireworks.splice(i,1)
        }
        this.scene.remove( this.launcher )
    }

    /**
     * update fireworks
     */
    update() {
        // do nothing if stopped
        if (this.stop) return

        // add new fireworks every 5% of the calls
        if(Math.random()  < 0.05 ) {
            this.fireworks.push(new MyFirework(this.fireworksGroup))
            console.log("firework added")
        }

        // for each fireworks 
        for( let i = 0; i < this.fireworks.length; i++ ) {
            // is firework finished?
            if (this.fireworks[i].done) {
                // remove firework 
                this.fireworks.splice(i,1) 
                console.log("firework removed")
                continue 
            }
            // otherwise upsdate  firework
            this.fireworks[i].update()
        }
    }
}
    

export { MyFireworks }