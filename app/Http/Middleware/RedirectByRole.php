<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectByRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, ?string $requiredRole = null): Response
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        // Jika middleware dipakai untuk membatasi akses ke route tertentu (misal: role:admin)
        if ($requiredRole && $user->role !== $requiredRole) {
            return match ($user->role) {
                'admin'   => redirect()->route('dashboard'),
                'cashier' => redirect()->route('pos.index'),
                default   => abort(403, 'Access not allowed.'),
            };
        }

        return $next($request);
    }
}
