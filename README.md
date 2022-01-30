# birbEgg


For @sableRaph's weekly Creative Coding Challenge. The Challenge topic was 'Egg'.

Basically I thought I was gonna have to work out how to do some smart stuff I didn't know how to do, then it turned out I didn't have to do the hard thing so here is basically a sketch that blender made.

# Blender Bit.
- Stretched a sphere so it was kind of an egg.
- Cell fracture with a material applied to the inner faces.
- Rigid Body Physics on the broken bits of egg.

# Bit where I thought I had to do stuff and then didn't.
- So last time I tried to apply a shader to an animated model it got very cross.
- Thought I'd need to pass co-ordinates into the vertex shader.
- Maybe do some maths.
- Maths makes my head hurt.
- Turns out this seems to only be when you've rigged stuff.

# Three bit.
- Looped through the scene and added a shader material wherever the inner face material I'd made in Blender was.
- Made the animation run when you click the title.
- Linked the whole egg's position to one of the broken bits and then made it transparent when it reached a certain position to fake a shell shatter.

# Shader Bit.
- Basically just simple stuff and then some Math.random() uniforms that change on click to give a little bit of variety.
- Little tiling and some noise on the floor.

# If only Bit.
- Would be nice to do this properly with physics.
- Or to find a way to add some randomisation to the animation somehow.
- Tried to do it by rotating the egg pieces on the animation reset but the pivot points were off I think.
- Could've just baked some other animations into it I guess but slightly more fiddly than it sounds.
