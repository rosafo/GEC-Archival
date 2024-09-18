<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let url: string;

	const dispatch = createEventDispatcher();

	function clearFileUrl() {
		dispatch('clearFileUrl');
	}
</script>

<div class="filepond--wrapper">
	<div
		class="filepond--root filepond--hopper"
		data-style-button-remove-item-position="left"
		data-style-button-process-item-position="right"
		data-style-load-indicator-position="right"
		data-style-progress-indicator-position="right"
		data-style-button-remove-item-align="false"
		style="height: 288px;"
	>
		<div class="filepond--list-scroller" style="transform: translate3d(0px, -4px, 0px);">
			<ul class="filepond--list" role="list">
				<li
					class="filepond--item"
					id="filepond--item-li3n5bjw0"
					style="transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1); opacity: 1; height: 256px;"
					data-filepond-item-state="idle"
				>
					<fieldset class="filepond--file-wrapper">
						<legend>&nbsp;</legend>
						<div class="filepond--file">
							<button
								class="filepond--file-action-button filepond--action-remove-item"
								type="button"
								data-align="left"
								style="transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1); opacity: 1;"
								on:click={clearFileUrl}
								><svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"
									><path
										d="M11.586 13l-2.293 2.293a1 1 0 0 0 1.414 1.414L13 14.414l2.293 2.293a1 1 0 0 0 1.414-1.414L14.414 13l2.293-2.293a1 1 0 0 0-1.414-1.414L13 11.586l-2.293-2.293a1 1 0 0 0-1.414 1.414L11.586 13z"
										fill="currentColor"
										fill-rule="nonzero"
									/></svg
								><span>Remove</span>
							</button>
							<div class="filepond--file-info" style="transform: translate3d(35px, 0px, 0px);">
								<span class="filepond--file-info-main" aria-hidden="true">&nbsp;</span><span
									class="filepond--file-info-sub">&nbsp;</span
								>
							</div>
							<div class="filepond--image-preview-wrapper">
								<div
									class="filepond--image-preview-overlay filepond--image-preview-overlay-idle"
									style="opacity: 1;"
								>
									<svg width="500" height="200" viewBox="0 0 500 200" preserveAspectRatio="none">
										<defs>
											<radialGradient id="gradient-1" cx=".5" cy="1.25" r="1.15">
												<stop offset="50%" stop-color="#000000" />
												<stop offset="56%" stop-color="#0a0a0a" />
												<stop offset="63%" stop-color="#262626" />
												<stop offset="69%" stop-color="#4f4f4f" />
												<stop offset="75%" stop-color="#808080" />
												<stop offset="81%" stop-color="#b1b1b1" />
												<stop offset="88%" stop-color="#dadada" />
												<stop offset="94%" stop-color="#f6f6f6" />
												<stop offset="100%" stop-color="#ffffff" />
											</radialGradient>
											<mask id="mask-1">
												<rect x="0" y="0" width="500" height="200" fill="url(#gradient-1)" />
											</mask>
										</defs>
										<rect x="0" width="500" height="200" fill="currentColor" mask="url(#mask-1)" />
									</svg>
								</div>
								<div
									class="filepond--image-preview"
									style="transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1); opacity: 1;"
								>
									<div
										class="filepond--image-clip"
										style="opacity: 1; height: 256px; width: 256px;"
									>
										<div
											class="filepond--image-canvas-wrapper"
											style="transform-origin: 256px 256px; transform: translate3d(-128px, -128px, 0px) scale3d(0.5, 0.5, 1) rotateZ(6.28319rad); opacity: 1; height: 512px; width: 512px;"
										>
											<div
												class="filepond--image-bitmap h-full w-full"
												style="transform: scale3d(1, 1, 1);"
											>
												<img src={url} alt="preview" class="w-full h-full" />
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</fieldset>
				</li>
			</ul>
		</div>
	</div>
</div>
