uniform float time; // Time variable for animation
uniform float radius;

void main()
{
    // Calculate the pulsatory effect by modifying the radius
    float newRadius = radius + sin(time) * 10.0; // Adjust the amplitude (0.2) as desired

    float cosA = position.x / radius;

    float sinA = position.y / radius;

    // Apply the pulsatory effect to the position
    vec3 newPosition = vec3(cosA * newRadius, sinA * newRadius, position.z);

    vec4 modelViewPosition = modelViewMatrix * vec4(newPosition, 1.0);

    gl_Position = projectionMatrix * modelViewPosition;
}
