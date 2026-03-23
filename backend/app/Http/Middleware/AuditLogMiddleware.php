<?php

namespace App\Http\Middleware;

use App\Models\AuditLog;
use Closure;
use Illuminate\Http\Request;

class AuditLogMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        if ($request->user() && $this->shouldLog($request)) {
            AuditLog::create([
                'user_id' => $request->user()->id,
                'action' => $request->method(),
                'target_type' => $this->getTargetType($request),
                'target_id' => $this->getTargetId($request),
                'changes' => json_encode($request->except(['password', 'password_confirmation'])),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
        }

        return $response;
    }

    private function shouldLog(Request $request)
    {
        return in_array($request->method(), ['POST', 'PUT', 'DELETE', 'PATCH']);
    }

    private function getTargetType(Request $request)
    {
        $path = $request->path();
        $segments = explode('/', $path);
        return $segments[1] ?? 'unknown';
    }

    private function getTargetId(Request $request)
    {
        $path = $request->path();
        $segments = explode('/', $path);
        return $segments[2] ?? null;
    }
}
